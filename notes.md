Notes
=====

+ Add extensions
+ Remove deleted files

+ Connect to Shopify and upload changes


have = {
}

foreach file in srcdir {
  // i.e. have["/some/crazy/path/file.liquid"] = true
  have[file] = true;
}

foreach file in dstdir {
  if (!have[file]) {
    rm dstdir/file
  }
}
