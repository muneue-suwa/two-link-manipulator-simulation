#!/usr/bin/bash

BUILD_DIR_NAME="build"
ARCHIVE_BASENAME="two-link-manipulator-simulation"

rm -rf $BUILD_DIR_NAME
mkdir $BUILD_DIR_NAME

cp README.md $BUILD_DIR_NAME
cp index.html $BUILD_DIR_NAME
cp -r js/ $BUILD_DIR_NAME

zip $ARCHIVE_BASENAME -r $BUILD_DIR_NAME
