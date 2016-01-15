#!/usr/bin/env bash
##
# Get Atrium Dev!
#
# Retrieve or update a local snapshot of Atrium to the latest development copy.
##

cd $1
rm -Rf openatrium
git clone --branch 7.x-2.x http://git.drupal.org/project/openatrium.git
