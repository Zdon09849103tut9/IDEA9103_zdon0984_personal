# IDEA9103_zdon0984_personal

## Audio-related animation of apple tree

### New Features introduction

#### The music playback and timeline functions are mainly implemented through various mouse commands. Specific interactions have been handled for mouse hover and click events on buttons, allowing users to control the entire webpage.

#### For animations, they are essentially set according to the music playback timeline. From the growth of the apples to their eventual fall, every stage is closely tied to changes in the music.
#### The main functions used include:

#### song.currentTime(): Retrieves the current playback time of the music, in seconds.

#### Loops related to appearOrder() and fallOrder():

#### Control the sequential appearance of apples—one every 0.66 seconds from bottom to top.

#### Control the apples’ falling action, starting at 44 seconds, one every 2 seconds from top to bottom.

#### These precisely control the timing of animations, circle appearances, falling, snowflakes, etc., all synchronized with the rhythm of the music.

#### setBrightness(factor): Dynamically changes the brightness of the circles based on volume.

#### setScale(factor): Dynamically changes the size of the circles based on volume.

#### startFalling(): Starts the falling animation for the circles.

#### updateFall(bottomY): Updates the position of circles as they fall.

#### resetFall(): Returns the circles to their original positions (cancels the falling effect).

#### Additionally, all the apples change their shape and brightness according to the music’s volume (not the user’s volume), allowing users to perceive the beat of the music.
#### The main functions used for this include:

#### amplitude = new p5.Amplitude();
#### Creates a p5.Amplitude object to detect the real-time volume level of the music.

#### amplitude.getLevel():
#### Gets the current real-time amplitude value of the music. The return value is between 0 and 1, representing the actual intensity of the music, unaffected by the user’s volume setting.

#### map(level, 0, 0.2, 0.9, 3.5, true):
#### Maps the obtained volume level to a specified brightness or scaling range, enabling dynamic visual changes.

#### setBrightness(factor):
#### Sets the brightness value for rendering apples (circles), with the parameter calculated dynamically based on the music’s volume.

#### setScale(factor):
#### Sets the scaling size of the apples, also calculated dynamically from the music’s volume, creating an animation effect that responds to the intensity of the music.

#### Currently, there is one unresolved issue:
#### The progress bar interferes with button usage. I haven’t found a solution for this yet, so I’ve disabled interaction with the progress bar for now.

#### This code was generated with the help of ChatGPT. Here’s the link to my conversation with ChatGPT:
https://chatgpt.com/share/6849fa6e-6ae4-8004-8b96-f11a776e4ee1