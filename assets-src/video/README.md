# Hero video (`public/video/hero-lab.{webm,mp4}`)

**Source:** NASA/JPL-Caltech, "From Taters to Terabits: NASA Wraps Up Deep Space Laser Test
(Behind the Scenes with DSOC)", JPL-20250918-PSYCHEf-0001.
https://commons.wikimedia.org/wiki/File:From_Taters_to_Terabits-_NASA_Wraps_Up_Deep_Space_Laser_Test_(JPL-20250918-PSYCHEf-0001-Behind_the_Scenes_with_DSOC).webm

**Licence:** public domain (NASA media). NASA media guidelines: no NASA logos/insignia and no
implied endorsement. The clip used here is a close-up of optical mounts with neither.

**Shot:** 83.8 s → 88.3 s (macro rack-focus across laser mirror mounts on an optical table),
played forwards then backwards for a seamless 9 s loop, graded darker/cooler for the site.

```sh
VF="trim=start=83.8:end=88.3,setpts=PTS-STARTPTS,fps=30,crop=ih*16/10:ih,scale=960:600:flags=lanczos,\
eq=brightness=-0.06:contrast=1.12:saturation=0.85,colorbalance=bs=0.08:bm=0.05:rs=-0.03,format=yuv420p,\
split[f][r];[r]reverse[rv];[f][rv]concat=n=2:v=1:a=0"
ffmpeg -i source.webm -filter_complex "$VF" -an -c:v libx264 -preset slow -crf 27 -profile:v high \
  -pix_fmt yuv420p -movflags +faststart hero-lab.mp4
ffmpeg -i source.webm -filter_complex "$VF" -an -c:v libvpx-vp9 -b:v 0 -crf 40 -row-mt 1 hero-lab.webm
ffmpeg -i hero-lab.mp4 -frames:v 1 hero-lab-poster.png   # → scripts/media.config.mjs (AVIF/WebP)
```
