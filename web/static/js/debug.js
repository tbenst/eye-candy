function sumCanvasPixels(canvas) {
    let ctx = canvas.getContext('2d');
    let h = canvas.height;
    let w = canvas.width;
    let pixels = ctx.getImageData(0,0,w,h).data;
    return pixels.reduce((a,b) => a+b)
}