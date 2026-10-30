"""Helpers for the Week 7 Bag-of-Visual-Words exercise.

Students do not need to modify this file. It loads the Caltech-6 dataset
(six categories from Caltech-101) and provides small plotting utilities
used by the notebook.
"""

from __future__ import annotations

from pathlib import Path
from typing import Dict, List, Optional, Sequence, Tuple

import numpy as np
from PIL import Image


# Categories with enough images and visually distinct objects.
DEFAULT_CATEGORIES = [
    "airplanes",
    "Motorbikes",
    "Faces",
    "watch",
    "car_side",
    "Leopards",
]


def find_caltech_root(start: Optional[Path] = None) -> Path:
    """Locate the `caltech-6` folder next to the notebook (or one level up)."""
    start = (start or Path.cwd()).resolve()
    candidates = [
        start / "caltech-6",
        start / "Exercises" / "W7" / "caltech-6",
        start / "Solutions" / "W7" / "caltech-6",
    ]
    for parent in start.parents:
        candidates.append(parent / "Exercises" / "W7" / "caltech-6")
        candidates.append(parent / "Solutions" / "W7" / "caltech-6")
        candidates.append(parent / "caltech-6")

    for path in candidates:
        if path.is_dir() and any(path.iterdir()):
            return path
    raise FileNotFoundError(
        "Could not find caltech-6. Expected it next to this notebook "
        "(Exercises/W7/caltech-6)."
    )


def list_image_paths(category_dir: Path) -> List[Path]:
    paths = sorted(category_dir.glob("image_*.jpg"))
    if not paths:
        paths = sorted(p for p in category_dir.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png"})
    return paths


def load_gray(path: Path, max_side: int = 300) -> np.ndarray:
    """Load an image as float grayscale in [0, 1], optionally downscaled."""
    image = Image.open(path).convert("L")
    w, h = image.size
    scale = max_side / max(w, h)
    if scale < 1.0:
        image = image.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.BILINEAR)
    return np.asarray(image, dtype=np.float32) / 255.0


def load_rgb(path: Path, max_side: int = 300) -> np.ndarray:
    image = Image.open(path).convert("RGB")
    w, h = image.size
    scale = max_side / max(w, h)
    if scale < 1.0:
        image = image.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.BILINEAR)
    return np.asarray(image, dtype=np.float32) / 255.0


def load_split(
    categories: Sequence[str] = DEFAULT_CATEGORIES,
    n_train: int = 25,
    n_test: int = 8,
    max_side: int = 300,
    seed: int = 0,
    root: Optional[Path] = None,
) -> Dict[str, object]:
    """Load a small train/test split from Caltech-6.

    Returns a dict with:
      - train_images / test_images: list of float grayscale arrays
      - train_labels / test_labels: integer class ids
      - train_paths / test_paths: source file paths
      - class_names: list of category folder names
      - root: Path to caltech-6
    """
    rng = np.random.default_rng(seed)
    root = Path(root) if root is not None else find_caltech_root()

    train_images, test_images = [], []
    train_labels, test_labels = [], []
    train_paths, test_paths = [], []
    class_names = []

    for label, name in enumerate(categories):
        category_dir = root / name
        if not category_dir.is_dir():
            raise FileNotFoundError(f"Missing category folder: {category_dir}")
        paths = list_image_paths(category_dir)
        if len(paths) < n_train + n_test:
            raise ValueError(
                f"Category '{name}' has only {len(paths)} images; "
                f"need at least {n_train + n_test}."
            )
        order = rng.permutation(len(paths))
        chosen = [paths[i] for i in order[: n_train + n_test]]
        train_chosen = chosen[:n_train]
        test_chosen = chosen[n_train:]

        for path in train_chosen:
            train_images.append(load_gray(path, max_side=max_side))
            train_labels.append(label)
            train_paths.append(path)
        for path in test_chosen:
            test_images.append(load_gray(path, max_side=max_side))
            test_labels.append(label)
            test_paths.append(path)
        class_names.append(name)

    return {
        "root": root,
        "class_names": class_names,
        "train_images": train_images,
        "test_images": test_images,
        "train_labels": np.asarray(train_labels, dtype=np.int64),
        "test_labels": np.asarray(test_labels, dtype=np.int64),
        "train_paths": train_paths,
        "test_paths": test_paths,
    }


def make_image_grid(
    images: Sequence[np.ndarray],
    labels: Optional[Sequence[int]] = None,
    class_names: Optional[Sequence[str]] = None,
    cols: int = 6,
    max_items: int = 12,
    per_class: Optional[int] = None,
):
    """Return (figure, axes) for a small montage of grayscale images.

    If ``per_class`` is set (and ``labels`` is given), show that many examples
    from each class with **one class per column** (examples stacked in the column).
    """
    import matplotlib.pyplot as plt

    if per_class is not None and labels is not None:
        labels_arr = np.asarray(labels)
        classes = list(np.unique(labels_arr))
        n_classes = len(classes)
        rows, cols = per_class, n_classes
        fig, axes = plt.subplots(rows, cols, figsize=(2.2 * cols, 2.2 * rows))
        axes = np.atleast_2d(axes)

        for ax in axes.ravel():
            ax.set_axis_off()

        for col, cls in enumerate(classes):
            idxs = np.flatnonzero(labels_arr == cls)[:per_class]
            for row, img_idx in enumerate(idxs):
                axes[row, col].imshow(images[int(img_idx)], cmap="gray")
                if class_names is not None and row == 0:
                    axes[row, col].set_title(class_names[int(cls)], fontsize=9)
        fig.tight_layout()
        return fig, axes

    n = min(len(images), max_items)
    cols = min(cols, n) if n else 1
    rows = int(np.ceil(n / cols)) if n else 1
    fig, axes = plt.subplots(rows, cols, figsize=(2.2 * cols, 2.2 * rows))
    axes = np.atleast_1d(axes).ravel()
    for ax in axes:
        ax.set_axis_off()
    for i in range(n):
        axes[i].imshow(images[i], cmap="gray")
        if labels is not None and class_names is not None:
            axes[i].set_title(class_names[int(labels[i])], fontsize=9)
    fig.tight_layout()
    return fig, axes
