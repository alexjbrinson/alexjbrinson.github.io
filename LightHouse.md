---
title: Lighthouse Problem
mathjax: True
classes: wide
---

![AnimatedBaesSpinning.gif](ComputationalPhysicsLab/LighthouseProblem/AnimatedBaesSpinning.gif)

The lighthouse problem was a computational physics lab assignment that I decided to go above and beyond for. Below is a brief summary of the problem and my solution.

## The Problem

Here's a statement of the the problem adapted from the Ph21 assignment:

<figure>
  <img src="ComputationalPhysicsLab/LighthouseProblem/LighthouseGeometry.PNG" alt="Lighthouse Geometry" class="center"/>
  <figcaption>Lighthouse Problem Geometry</figcaption>
</figure>

> There is a deffective lighthouse located at a position α along the shore and a distance β out to sea (see figure above). The lighthouse emits highly collimated ﬂashes at random times and at random azimuths (a good lighthouse emits ﬂashes at regular intervals, usually due to rotation of the lighthouse beam). A dense array of photodetectors is set up along the shore and each ﬂash is recorded by a single photodetector. The data consist of the position $$x_k$$ of the illuminated photodector for the $$k$$th flash. 

> Consider the case where neither α nor β are known beforehand. Calculate the distributions of the logarithm of the posterior probability for a grid of α and β values. Then plot the 2-dimensional distribution of the posterior distribution as a contour plot in the α-β plane.

## Solution

As you might've guessed from the use of the word "posterior", the main idea is to use Bayesian statistics to infer the lighthouse's position based on a string of photodetector data. From Bayes' theorem:

$$  P(h \vert e) = \frac{P(e \vert h)P(h)}{P(e)} $$

where $$P(h \vert e)$$ is the _posterior_ probability assigned to some hypothesis h based on some set of evidence e, $$P(h)$$ is the _prior_ probability assigned to h (prior to observing e), and $$P(e \vert h)$$ is the _likelihood_ of observing evidence e given that h is true. $$P(e)$$ will just amount to a normalization factor on the posterior distibution; I don't know the cool jargon for it.


