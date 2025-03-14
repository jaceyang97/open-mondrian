# Open Mondrian

> Mondrian hoped to convey the idea of the eternal movement of life in his works. He believed that this goal could be subtly achieved by changing the width of black lines. He reasoned that the thinner the line, the faster the eye "reads" its trajectory, and vice versa. By adjusting the width, he could manipulate lines much like pressing the accelerator of a car. This, in turn, would help him achieve his ultimate goal: to imbue his paintings with a sense of "dynamic balance."
> 
> -- Not Mondrian

## About

Open Mondrian is a React application that allows users to generate Mondrian-style artwork by adjusting various parameters. Piet Mondrian's work, especially his Composition series, can be viewed as early generative art, with carefully balanced lines, rectangles, and primary colors.

This project lets you explore the principles behind Mondrian's compositions by creating your own variations with customizable settings.

## Features

- Generate Mondrian-style compositions with a recursive algorithm
- Adjust canvas dimensions, cell sizes, and line thickness
- Customize the color palette
- Control the probability of colored cells and cell splitting
- Instantly regenerate compositions with your settings

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/open-mondrian.git
   cd open-mondrian
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## How It Works

The Mondrian generator works by:

1. Starting with a single cell representing the entire canvas
2. Recursively splitting cells either horizontally or vertically
3. Deciding whether to split based on probability and minimum cell size
4. Assigning colors to cells based on a color palette and probability
5. Rendering the resulting cells and grid lines on a canvas

## Customization

You can adjust various parameters to create different compositions:

- **Canvas Width/Height**: Set the dimensions of your artwork
- **Min/Max Cell Size**: Control the size range of rectangles
- **Line Thickness**: Adjust the width of the black grid lines
- **Line Color**: Change the color of the grid lines
- **Color Palette**: Add or remove colors from the palette
- **Color Probability**: Control how many cells receive color
- **Split Probability**: Adjust how likely cells are to be divided
- **Max Depth**: Limit the recursion depth for cell splitting

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

Inspired by [mondriangenerator.io](https://www.mondriangenerator.io/) and the works of Piet Mondrian.
