# -*- coding: utf-8 -*-
"""
Created on Thu May  4 17:41:55 2017

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
print(gcd(20,13))
        