# -*- coding: utf-8 -*-
"""
Created on Tue May  9 19:40:00 2017

@author: super
"""
import math

def gcd(a,b):
    r = a%b
    q = math.floor(a/b)
    if r == 0:
        g,x,y = b,0,1
    else:
        (g,x,y) = gcd(b,r)
        x,y = y, -1*q*y+x
    return (g,x,y)

def mod(a,n):
    #returns the integer 0<= c < n such that a = c (mod n)
    return a - (a/n)*n #if a >= 0 else (a/n)*n-a

def add(a,b,n):
    #adds a and b in the ring Z/nZ (returns a+b (mod n))
    return mod(a+b,n)

def mult(a,b,n):
    #returns a*b (mod n)
    return mod(a*b, n)

def inverse(a,n):
    # returns the inverse of a assuming that (a,n) = 1
    return mod(int(gcd(n,a)[2]),n) 
    
print(mod(-12,5), mod(-5,3), mod(-21,3))