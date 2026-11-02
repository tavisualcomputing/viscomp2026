# [viscomp2026](https://vlg.inf.ethz.ch/teaching/Visual-Computing.html)

GitHub repository for the Visual Computing course 2026 at ETH Zurich.

## Requirements for the Vision Part

- [Python 3](https://www.python.org/downloads/)
- [JupyterLab](https://jupyter.org/install)
- NumPy and Matplotlib

Clone this repository and open the exercise notebooks from the corresponding folder under `Exercises/`.

### Google Colab

The vision notebooks can also run in [Google Colab](https://colab.research.google.com/), without a local Python installation.

For Exercise 1, open the notebook directly in Colab:

[![Open Exercise 1 in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/tavisualcomputing/viscomp2026/blob/main/Exercises/W2/week2_digital_image_student.ipynb)

The notebook downloads its accompanying image from this repository when the file is not already available locally.

Alternatively, in Colab select **File > Open notebook > GitHub** and enter:

`https://github.com/tavisualcomputing/viscomp2026`

## Requirements for the Graphics Part

We highly recommend using Visual Studio Code for solving the exercises, though you are free to choose any IDE.

To see the output of your code while solving the exercises, please follow one of the steps below:

- **VS Code:** Right-click the `.html` file and select **Open in Integrated Browser**. No extension needed.
- **Python 3:** In the directory containing the `.html` file, run `python3 -m http.server` (`python -m http.server` on Windows). Then open [http://localhost:8000](http://localhost:8000) in your browser. 8000 is the default port. To use another one, add its number to the end of the command, for example `python3 -m http.server 8003`, and open [http://localhost:8003](http://localhost:8003) instead.

Opening the `.html` file directly from disk (a `file://` address) does not work. The browser blocks the exercise's JavaScript modules and the page stays empty or shows an error.

Some browsers or versions may not be supported. Please check the WebGL initialization code in the respective exercise or ask us during the exercise sessions.

For syntax highlighting in Visual Studio Code, we recommend the **WebGL GLSL Editor** extension.
