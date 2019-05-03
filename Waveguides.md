---
title: Waveguides
classes: wide
mathjax: true
---

![RectangularWaveguide_H_TE_3_2_SurfaceField_MoreDetail.gif](WaveGuideAnimations/RectangularWaveguideModes/RectangularWaveguide_H_TE_3_2_SurfaceField_MoreDetail.gif)

## Waveguide Animations

Here are some waveguide animations I generated with Mathematica. The animations show the temporal and spatial dependencies of either the electric ($$\vec{E}$$) or magnetic ($$\vec{H}$$) fields for different TE and TM modes propagating through rectangular/right-triangular hollow waveguides.
Unlike the plain plane-wave solutions typical of electromagnetic waves in free space, the boundary conditions for hollow waveguides don't allow TEM modes. Instead, the most generic field propagation through a hollow waveguide can be decomposed into modes of two types of: Transverse Electric (TE) and Transverse Magnetic (TM). In a TE mode the E-field is entirely transverse (perpendicular to the direction of propagation), but the H-Field will have a longitudinal component, and vice-versa for a TM mode.

### Right-Triangular Waveguide Modes

Transverse Magnetic (TM) | Transverse Electric (TE)
------------ | -------------
![TriangleCrossSection_E_TM_3_2.gif](WaveGuideAnimations/TriangularWaveguideModes/TriangleCrossSection_E_TM_3_2.gif) | ![TriangleCrossSection_H_TE_3_2.gif](WaveGuideAnimations/TriangularWaveguideModes/TriangleCrossSection_H_TE_3_2.gif)
![TriangleSurface_E_TM_3_2.gif](WaveGuideAnimations/TriangularWaveguideModes/TriangleSurface_E_TM_3_2_Cropped.gif) | ![TriangleSurface_H_TE_3_2.gif](WaveGuideAnimations/TriangularWaveguideModes/TriangleSurface_H_TE_3_2_Cropped.gif)

___

## Mathematica Notebook
The animations on this page, as well as several others, can be viewed from my [github repository](https://github.com/alexjbrinson/WaveguideAnimations). The repository also contains the Mathematica notebook I wrote to generate the rectangular waveguide animations: [AnimationsRectangular.nb](WaveGuideAnimations/AnimationsRectangular.nb). I'm not including any code particular to the right-triangular geometry, but feel free to download this notebook and generate your own animations for different modes, or linear combinations of modes.
