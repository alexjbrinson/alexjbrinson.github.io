import numpy as np
from scipy.special import factorial as fact
import matplotlib
import matplotlib.cm as cm
import matplotlib.pyplot as plt
import scipy.interpolate
from mpl_toolkits.mplot3d import Axes3D
import matplotlib.animation as animation
from time import time

"""Pertinent parameter values"""
a = float(1) #true lighthouse alpha parameter
b = float(2) #true lighthouse beta parameter
j = 8 #I'll generate 2^j data points

def UniformDist(alp, arg1=None, arg2=None): #Uniform probability density function. vectorized to Unif
	assert (alp >= -10) & (alp <= 10)
	return 1

Unif = np.vectorize(UniformDist)

def WeightedStats(vals1, vals2, weights):
#Takes parms as vals, and probHs as weights, then just return the coords of the mode, and height
	pkB, pkA = np.unravel_index(weights.argmax(), weights.shape)
	mode = np.array([vals1[0, pkA], vals2[pkB, 0], weights[pkB, pkA]])
	return mode

def Prob(alp, beta, x, priorAB):
	pro = priorAB
	lh = beta/(np.pi * ((x-alp)**2 + beta**2))
	pro = pro*lh
	return pro

def Conditioner(data, j, aparms, bparms, priorA, priorB, arg1=None,arg2=None, arg3=None,arg4=None):
#Same as Conditioner, but uses log likelihood, as recommended by the hint.
	priAlpha = priorA(aparms, arg1, arg2)
	priBeta  = priorB(bparms, arg3, arg4)
	OB = np.multiply(priAlpha, priBeta)
	OB = OB/float(np.sum(OB)) #Distribution prior to data
	probHs = OB
	distrbs = OB[...,np.newaxis] #this will store my distribution for each subset of data
	m = np.amax(OB)
	stats = np.array([0.0, 0.0, OB[0,0]])
	print "l = 0, Stats = ", stats
	allStats = stats
	for i in range(0, 2**j):
		d = data[i] #treat previous probH as prior, and then parameterize ith data point.
		assert(aparms.shape == bparms.shape == probHs.shape)
		probHs = Prob(aparms, bparms, d, probHs)
		probHs = probHs/np.sum(probHs) #normalizing
		stats = WeightedStats(aparms, bparms, probHs)
		if i+1 in np.exp2(np.arange(j)):
			print "l = ", i+1, ", Stats: = ", stats
		distrbs = np.concatenate((distrbs, probHs[...,np.newaxis]), axis = -1)
		allStats = np.vstack((allStats, stats))
		if m < np.amax(probHs): 
			m = np.amax(probHs)		
	return (distrbs, allStats, m) #returns a tuple with all that stuff...


"""Generating data to conditionalize on"""
thetaD = np.random.uniform(-np.pi/2, np.pi/2, 2**j) #data set of theta vals between -pi/2 and pi/2, pulled from a uniform distribution
xD = b*np.tan(thetaD) + a

"""Histogram plots of data"""
plt.figure(1)
plt.subplot(121)
plt.hist(thetaD, bins=15)
plt.subplot(122)
nums, bins, patches = plt.hist(xD, bins='auto')
plt.savefig('DataDistributionLighthouseFlashes.png')
#plt.show()
plt.clf()
 

"""computing posteriori distributions"""
parmsA = np.linspace(-5, 5, num = 1001)#alpha parameter vals
parmsB = np.linspace(0, 5, num = 501)#beta parameter vals
aa, bb = parms = np.meshgrid(parmsA, parmsB)

(disUnif,  statsUnif,  mUnif) =  Conditioner(xD, j, aa, bb, Unif, Unif, None, None)
print "disUnif", disUnif.shape, "\n", disUnif[:,:,1].shape
print "FinalstatsUnif:\n", statsUnif[-1], "\n Max prob = ", mUnif


"""Plotting 3d wireframe posteriors from uniform priors"""
"""
fig = plt.figure(1)
ax = fig.add_subplot(111, projection='3d')
plt.title("Bayesian Conditionalization with Uniform Prior and 0 data points")
plt.xlabel("Possible alpha values")
plt.ylabel("possible beta values")
ax.plot_wireframe(aa, bb, disUnif[:,:,0], rstride=20, cstride=20)
plt.savefig('AlphaDistUnif0.png')
for i in range(0, j+1):
	l = 2**i
	plt.cla()
	plt.title("Bayesian Conditionalization with Uniform Prior and "+str(l)+" data points")
	plt.xlabel("Alpha")
	plt.ylabel("Beta")
	ax.plot_wireframe(aa,bb, disUnif[:,:,l], rstride=20, cstride=20)
	plt.savefig('AlphaDistUnif' + str(l)+'.png')
"""

"""
    return dx/dy
ext = [-5, 5, 0, 5]"""

"""Plotting (and animating?!?!) contour plots from uniform priors"""
"""
gifig = plt.figure(2)
ax = gifig.add_subplot(211)
historgram = ax.plot([])
ax.set_title('Positions of First 0 Flashes')
ax.axis([min(bins), max(bins), 0, max(nums)])
ax.set_xlabel('Position')
ax.set_ylabel('Count')
ay = gifig.add_subplot(212)
condor = ay.contour(aa, bb, disUnif[:,:,2**j])
plt.colorbar(condor)
ay.set_title('Parameter Contour Plot with Uniform prior and 0 data points')
ay.axis([-5, 5, 0, 5])
ay.set_xlabel('alpha parameter values')
ay.set_ylabel('beta parmater values')
plt.imshow(disUnif[:,:,2**j], vmin=0, vmax = statsUnif[-1][2], extent = [-5, 5, 0, 5], origin='lower', alpha=0.8) #pls work

def updater(i):
	ax.clear()
	ay.clear()
	historgram = ax.hist(xD[:i], bins=bins)
	ax.set_title('Positions of First '+str(i)+' Flashes')
	ax.axis([-20, 20, 0, max(nums)])
	ax.set_xlabel('Position')
	ax.set_ylabel('Count')
	ay.set_title('Parameter Contour Plot with Uniform prior')
	#ay.axis([-5, 5, 0, 5])
	ay.set_xlabel('alpha parameter values')
	ay.set_ylabel('beta parmater values')
	plt.imshow(disUnif[:,:,i], vmin=0, vmax = statsUnif[-1][2], extent = [-5, 5, 0, 5], origin='lower', alpha=0.7)
	condor = ay.contour(aa, bb, disUnif[:,:,i])
	return [historgram, condor]

#Computing a good time step between animation frames
t0 = time()
updater(0)
t1 = time()
interv = (t1 - t0)

anims = animation.FuncAnimation(gifig, updater, frames = 2**j+1, interval=interv, blit=False)
anims.save('DisGif.gif', dpi=80, fps=8, writer='imagemagick')
plt.show()
#plt.savefig('CondorTheContourPlot.png')
plt.show()
"""

"""3D animated wirefram/surface plot!"""
def update(i):
	ax.clear()
	plt.title("Bayesian Conditionalization with Uniform Prior and "+str(i)+" data points")
	ax.set_xlim([5.0, -5.0])
	ax.set_xlabel('Alpha')
	ax.set_ylim([0.0, 5.0])
	ax.set_ylabel('Beta')
	ax.set_zlim([0.0, mUnif])
	ax.set_zlabel('p')
	xcent, ycent, p = statsUnif[i]
	label = "("+str(xcent)+", "+str(ycent)+")"#, p = "+str(p)
	ax.text(xcent, ycent, p*1.1, label)
	ax.view_init(16-7*np.sin(2*np.pi*float(i)/(2**j)), 115+360*float(i)/2**j)
	w = ax.plot_wireframe(aa, bb, disUnif[:,:,i], cmap=cm.jet, rstride=12, cstride=12, alpha=0.5+float(i)/(2 * 2**j))
	return w,

fig = plt.figure(1)
#fig.set_size_inches(10, 10)
plt.title("Bayesian Conditionalization with Uniform Prior and 0 data points")
ax = fig.add_subplot(111, projection='3d')
ax.set_xlim([5.0, -5.0])
ax.set_xlabel('Alpha')
ax.set_ylim([0.0, 5.0])
ax.set_ylabel('Beta')
ax.set_zlim([0.0, mUnif])
ax.set_zlabel('p')
ax.view_init(13, 115)
w = ax.plot_wireframe(aa, bb, disUnif[:,:,0], cmap=cm.jet, rstride=12, cstride=12, alpha=0.5)

#Computing a good time step between animation frames
t0 = time()
update(0)
t1 = time()
inter = (t1 - t0)

anim = animation.FuncAnimation(fig, update, frames = 2**j+1, interval=inter, blit=False)
#anim.save('BaeCon.mp4', fps=10, extra_args=['-vcodec', 'libx264'])
anim.save('AnimatedBaes.gif', dpi=80, fps=8, writer='imagemagick')
plt.show()





