coffee --watch --compile -o eyecandy/static/ eyecandy/coffee/

## Reset Canvas
// Store the current transformation matrix
context.save();

// Use the identity matrix while clearing the canvas
context.setTransform(1, 0, 0, 1, 0, 0);
context.clearRect(0, 0, canvas.width, canvas.height);

// Restore the transform
context.restore();