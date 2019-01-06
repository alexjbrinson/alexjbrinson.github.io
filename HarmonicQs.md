---
title: The _Other_ Spherical Harmonics
classes: wide
mathjax: true
---

<iframe src="https://www.wolframcloud.com/objects/5871cd13-26cc-4e96-b933-83e67f17f2e8?_embed=iframe" width="600" height="500"></iframe>

Everybody (who's anybody) knows about the Legendre Polynomials $$P_l$$ and their associated functions $$P_l^m$$. It is also well-known that the associated polynomials as a function of the polar angle, $$P_l^m(\cos(\theta))$$, when multiplied by a complex exponential in the azimuthal angle, $$e^{i\frac{m \phi}{2 \pi}}$$, produce particularly important type of function known as a "Spherical Harmonic", $$Y_l^m(\theta,\phi) = P_l^m(\cos(\theta)) e^{i\frac{m \phi}{2 \pi}}.$$

But what most people _don't_ know, is that the Legendre Polynomials actually have an ~~evil~~ misunderstood twin: **The Legendre Q Functions**

** Legendre Equation (TODO)

The Legendre equation pops up in a number of different places in Physics, most notably in the contexts of electrostatic potentials and wavefunctions of the hydrogen atom. In both of those cases, the generalized legendre equation arises when using Separation of Variables in spherical coordinates to solve 2nd order PDEs -- the Laplace equation in electrostatics, and the Schrödinger equation in quantum mechanics (Fun fact: In the absence of a potential function V, the Schrödinger equation reduces to a diffusion equation with an imaginary coefficient, which yields wave-like solutions with a non-trivial dispersion relation). The _generalized Legendre equation_ is:

$$ \frac{d}{dx}[(1-x^2)\frac{dP}{dx}]+[l(l+1)-\frac{m^2}{1-x^2}]P(x) = 0 $$

In cases where we can set m = 0 (As it does in separation of variables problems with azimuthal symmetry), this reduces to the _Legendre equation_ (not generalized):

$$ \frac{d}{dx}[(1-x^2)\frac{dP}{dx}]+l(l+1)P(x) = 0 $$

If we assume polynomial solutions -- that is, of the form $$P_l(x) = \Sum a_j x^j$$ -- Then one finds a set of solutions to the Legendre equation known as the _Legendre Polynomials_, which are given by _Rodrigues' Formula_: 

$$P_l(x) = \frac{1}{2^ll!}(\frac{d}{dx})^l(x^2-1)^l

![P_l(x) Plot goes here]()|![P_l(Cos(theta)) plot goes here]()

Test1|Test2
------------ | -------------
<iframe src="https://www.wolframcloud.com/objects/c350cd36-8b1e-4ca5-9869-75b9596659e7?_embed=iframe" width="600" height="500"></iframe>
