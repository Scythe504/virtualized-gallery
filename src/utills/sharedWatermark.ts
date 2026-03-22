export const applyWatermark = (ctx: OffscreenCanvasRenderingContext2D, width: number, height: number) => {
  ctx.font = `bold ${width * 0.08}px sans-serif`
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText("Celebrare", width / 2, height / 2)
}