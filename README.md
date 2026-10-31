# GitHub Contribution Graph Desk Nameplate

![](models/desk-nameplate-preview-real.jpg)

A GitHub contribution graph themed desk nameplate.

- 3 pieces (stand, nameplate, colored inserts)
- Colored dots are printed separately and easy to insert to customize post-printing.

## About this fork

This is a fork of [chriswblake/github-desk-nameplate](https://github.com/chriswblake/github-desk-nameplate). All credit for the original project goes to [Chris (@chriswblake)](https://github.com/chriswblake), who created the nameplate, the 3D models, and the nameplate designer. Please star and share [the original repo](https://github.com/chriswblake/github-desk-nameplate).

The models are unchanged. This fork adds a commit graph background to the designer, which is hosted at **[foreverend.github.io/github-desk-nameplate](https://foreverend.github.io/github-desk-nameplate/)**.

What this fork adds:

- **Commit graph background** - fills every empty location with a generated contribution graph, with busier weekdays, quiet weekends, and bursts of activity.
- **Shades and Variation sliders** - choose how many shades of green to print and how evenly they are mixed.
- **Text halo** - keeps the locations next to your text dark so the letters stand out.
- **Shuffle commits** - generates a new pattern with the same settings.
- **Automatic insert counts** - shades are added to the palette for you, and an **Inserts to print** list shows how many you need in each color. The total is also included in **Download counts**.
- **Saved settings** - graph settings are kept in saved designs, in downloaded JSON and PNG files, and in undo/redo.

See [Commit graph background](#commit-graph-background) for how to use it.

This fork is shared under the same [CC BY-NC 4.0](LICENSE) license as the original project, so it can't be used commercially.

## How to Build

### Prerequisites

- 3D printer with 250mm width.
- Black filament
- White filament
- Green filament

### Print the parts and assemble

1. Preview the model files in the `./models/` folder.
   - Nameplate - vertical part with grid
   - Insert - the colored dots to insert in the grid
   - Stand - horizontal part to hold nameplate
1. Open `.3mf` file or load the `.stl` files into your slicing software.
1. Print the parts. No special settings are required.
1. Insert colored dots into the grid to spell your name or decorate!
   > **💡 Tip:** You can use the [nameplate designer](https://foreverend.github.io/github-desk-nameplate/) web app to try different ideas.
  <a href="https://foreverend.github.io/github-desk-nameplate/"><img width="350px" alt="screenshot of namplate designer" src="docs/designer-preview.png"></a>
1. Share your design on the original project's [Show and Tell](https://github.com/chriswblake/github-desk-nameplate/discussions/1) page!  
(and secretly your now even _more_ awesome desk setup)

> [!TIP]
> Print the inserts in different colors! 🦄


## Commit graph background

The designer can fill every empty location with a realistic-looking contribution graph, so the text sits in front of a full plate instead of empty holes.

1. Pick a color and add your text. White has the strongest contrast against every shade of green.
1. Turn on **Commit graph background**.
1. Adjust the sliders:
   - **Shades of green** - how many insert colors to print (2-6). Four matches GitHub's dark theme exactly.
   - **Variation** - how evenly the shades are mixed. At 0% everything is the darkest shade, and at 100% every shade is equally common.
   - **Text halo** - keeps locations next to the text in the darkest shades so the letters stay readable.
1. Use **Shuffle commits** until you like the pattern.

Shades are added to the color palette automatically, and **Inserts to print** lists how many inserts you need in each color. Print a few spares of each.

## Contributing

All files are available, including the original Fusion `.f3d` files. Pull requests are welcome.

The nameplate designer is a [GitHub Pages](docs/github-pages.md) site. See the dedicated instructions for contributing to it.

### Easy contribution ideas

- Alternative stands
- Other decorations using the insert shape.
