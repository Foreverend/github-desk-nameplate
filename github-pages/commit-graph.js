/*
 * Generates a realistic-looking contribution graph for the empty nameplate
 * locations. Columns are weeks and rows are days (Sunday at the top).
 *
 * Every location gets a fixed activity score from the seed, and the sliders
 * only change how those scores are divided into shades. A location therefore
 * moves smoothly between shades as a slider is dragged, and the same settings
 * always produce the same design and the same insert counts.
 */
(function (global) {
  "use strict";

  // GitHub's dark theme contribution colors, least to most active. Other shade
  // counts are sampled from this ramp, so four shades match GitHub exactly.
  var RAMP = ["#0e4429", "#006d32", "#26a641", "#39d353"];
  // Sunday through Saturday. Weekends are quieter than the working week.
  var DAY_WEIGHTS = [0.4, 0.95, 1, 1, 1, 0.9, 0.45];

  var MIN_SHADES = 2;
  var MAX_SHADES = 6;
  var MAX_HALO = 2;
  var DEFAULTS = Object.freeze({
    shades: 4,
    variation: 50,
    halo: 1,
    seed: 2026,
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // Small seeded generator (mulberry32) so designs can be reproduced.
  function createRandom(seed) {
    var value = seed >>> 0;
    return function () {
      value = (value + 0x6d2b79f5) | 0;
      var t = Math.imul(value ^ (value >>> 15), 1 | value);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hexToRgb(hex) {
    return [1, 3, 5].map(function (start) {
      return parseInt(hex.slice(start, start + 2), 16);
    });
  }

  function rgbToHex(rgb) {
    return (
      "#" +
      rgb
        .map(function (channel) {
          return Math.round(channel).toString(16).padStart(2, "0");
        })
        .join("")
    );
  }

  function sampleRamp(position) {
    var scaled = position * (RAMP.length - 1);
    var start = Math.min(Math.floor(scaled), RAMP.length - 2);
    var mix = scaled - start;
    var from = hexToRgb(RAMP[start]);
    var to = hexToRgb(RAMP[start + 1]);
    return rgbToHex(
      from.map(function (channel, index) {
        return channel + (to[index] - channel) * mix;
      })
    );
  }

  // Evenly spaced shades of green, darkest first.
  function shadeColors(count) {
    var shades = [];
    for (var i = 0; i < count; i++) shades.push(sampleRamp(i / (count - 1)));
    return shades;
  }

  // How busy each week is: a slow drift, a few project bursts, and some quiet
  // weeks such as holidays.
  function weeklyActivity(cols, random) {
    var weeks = [];
    var drift = random();
    for (var c = 0; c < cols; c++) {
      drift = clamp(drift + (random() - 0.5) * 0.5, 0, 1);
      weeks.push(0.35 + drift);
    }

    var bursts = 3 + Math.floor(random() * 3);
    for (var b = 0; b < bursts; b++) {
      var center = random() * cols;
      var width = 1.5 + random() * 3;
      var strength = 0.8 + random() * 1.2;
      for (var w = 0; w < cols; w++) {
        var distance = (w - center) / width;
        weeks[w] += strength * Math.exp(-distance * distance);
      }
    }

    var breaks = 1 + Math.floor(random() * 3);
    for (var q = 0; q < breaks; q++) {
      var start = Math.floor(random() * cols);
      var length = 1 + Math.floor(random() * 2);
      for (var k = start; k < Math.min(cols, start + length); k++)
        weeks[k] *= 0.2;
    }
    return weeks;
  }

  // Scores are compared by rank only. Commit counts are bursty, so the daily
  // noise is exponential: most days are ordinary and a few stand out.
  function activityScores(rows, cols, seed) {
    var random = createRandom(seed);
    var weeks = weeklyActivity(cols, random);
    var scores = [];
    for (var r = 0; r < rows; r++) {
      var row = [];
      for (var c = 0; c < cols; c++) {
        var noise = -Math.log(1 - random());
        row.push(weeks[c] * DAY_WEIGHTS[r] * noise);
      }
      scores.push(row);
    }
    return scores;
  }

  // Share of locations per shade. At 0 everything is the darkest shade, at 100
  // every shade is equally common, and between them each brighter shade is
  // rarer than the last, like a real contribution graph.
  function shadeShares(count, variation) {
    var falloff = variation / 100;
    var weights = [];
    var total = 0;
    for (var i = 0; i < count; i++) {
      weights.push(Math.pow(falloff, i));
      total += weights[i];
    }
    return weights.map(function (weight) {
      return weight / total;
    });
  }

  // Assign shades by rank so the counts hit the target shares exactly.
  function assignShades(locations, count, variation, levels) {
    var shares = shadeShares(count, variation);
    var sorted = locations.slice().sort(function (a, b) {
      return a.score - b.score;
    });
    var cumulative = 0;
    var shade = -1;
    var limit = 0;
    sorted.forEach(function (location, index) {
      while (index >= limit && shade < count - 1) {
        shade++;
        cumulative += shares[shade];
        limit = Math.round(cumulative * sorted.length);
      }
      levels[location.row][location.col] = shade;
    });
  }

  function isNearForeground(foreground, row, col, halo) {
    for (var r = row - halo; r <= row + halo; r++) {
      if (!foreground[r]) continue;
      for (var c = col - halo; c <= col + halo; c++)
        if (foreground[r][c]) return true;
    }
    return false;
  }

  // Returns levels[row][col]: a shade index, or null for foreground locations.
  // Locations within `halo` cells of the foreground stay in the darker third of
  // the shades so text keeps its contrast against the graph.
  function generateLevels(options) {
    var foreground = options.foreground;
    var shades = options.shades;
    var rows = foreground.length;
    var cols = foreground[0].length;
    var scores = activityScores(rows, cols, options.seed);
    var levels = [];
    var open = [];
    var nearby = [];
    for (var r = 0; r < rows; r++) {
      levels.push(new Array(cols).fill(null));
      for (var c = 0; c < cols; c++) {
        if (foreground[r][c]) continue;
        var location = { row: r, col: c, score: scores[r][c] };
        var near =
          options.halo > 0 && isNearForeground(foreground, r, c, options.halo);
        (near ? nearby : open).push(location);
      }
    }
    assignShades(open, shades, options.variation, levels);
    assignShades(
      nearby,
      Math.floor((shades - 1) / 3) + 1,
      options.variation,
      levels
    );
    return levels;
  }

  global.NameplateCommitGraph = {
    MIN_SHADES: MIN_SHADES,
    MAX_SHADES: MAX_SHADES,
    MAX_HALO: MAX_HALO,
    DEFAULTS: DEFAULTS,
    shadeColors: shadeColors,
    generateLevels: generateLevels,
  };
})(typeof window !== "undefined" ? window : this);
