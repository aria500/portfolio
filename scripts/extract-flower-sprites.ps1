param(
  [Parameter(Mandatory = $true)][string]$Source,
  [Parameter(Mandatory = $true)][string]$Output
)

Add-Type -AssemblyName System.Drawing

$sourceImage = [System.Drawing.Bitmap]::new($Source)
$cellStep = [int]($sourceImage.Width / 12)
$cellWidth = 224
$cellHeight = [int]($sourceImage.Height / 4)
$flowerColumns = @(0, 6)

New-Item -ItemType Directory -Force -Path $Output | Out-Null

for ($row = 0; $row -lt 4; $row++) {
  for ($group = 0; $group -lt 2; $group++) {
    $flowerIndex = ($row * 2) + $group + 1
    $flowerFolder = Join-Path $Output ("flower-{0:D2}" -f $flowerIndex)
    New-Item -ItemType Directory -Force -Path $flowerFolder | Out-Null

    for ($stage = 0; $stage -lt 6; $stage++) {
      $crop = [System.Drawing.Bitmap]::new($cellWidth, $cellHeight, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
      $graphics = [System.Drawing.Graphics]::FromImage($crop)
      $graphics.Clear([System.Drawing.Color]::Transparent)
      $centerX = (($flowerColumns[$group] + $stage) * $cellStep) + [int]($cellStep / 2)
      $sourceX = [Math]::Max(0, $centerX - [int]($cellWidth / 2))
      $sourceWidth = [Math]::Min($cellWidth, $sourceImage.Width - $sourceX)
      $destinationX = if ($centerX - [int]($cellWidth / 2) -lt 0) { [Math]::Abs($centerX - [int]($cellWidth / 2)) } else { 0 }
      $graphics.DrawImage(
        $sourceImage,
        [System.Drawing.Rectangle]::new($destinationX, 0, $sourceWidth, $cellHeight),
        [System.Drawing.Rectangle]::new($sourceX, $row * $cellHeight, $sourceWidth, $cellHeight),
        [System.Drawing.GraphicsUnit]::Pixel
      )
      $graphics.Dispose()

      $background = New-Object 'bool[,]' $cellWidth, $cellHeight
      $queue = [System.Collections.Generic.Queue[System.Drawing.Point]]::new()

      for ($x = 0; $x -lt $cellWidth; $x++) {
        $queue.Enqueue([System.Drawing.Point]::new($x, 0))
        $queue.Enqueue([System.Drawing.Point]::new($x, $cellHeight - 1))
      }
      for ($y = 1; $y -lt $cellHeight - 1; $y++) {
        $queue.Enqueue([System.Drawing.Point]::new(0, $y))
        $queue.Enqueue([System.Drawing.Point]::new($cellWidth - 1, $y))
      }

      while ($queue.Count -gt 0) {
        $point = $queue.Dequeue()
        if ($background[$point.X, $point.Y]) { continue }
        $color = $crop.GetPixel($point.X, $point.Y)
        $maxChannel = [Math]::Max($color.R, [Math]::Max($color.G, $color.B))
        $minChannel = [Math]::Min($color.R, [Math]::Min($color.G, $color.B))
        if ($minChannel -lt 232 -or ($maxChannel - $minChannel) -gt 14) { continue }

        $background[$point.X, $point.Y] = $true
        $crop.SetPixel($point.X, $point.Y, [System.Drawing.Color]::Transparent)
        if ($point.X -gt 0) { $queue.Enqueue([System.Drawing.Point]::new($point.X - 1, $point.Y)) }
        if ($point.X + 1 -lt $cellWidth) { $queue.Enqueue([System.Drawing.Point]::new($point.X + 1, $point.Y)) }
        if ($point.Y -gt 0) { $queue.Enqueue([System.Drawing.Point]::new($point.X, $point.Y - 1)) }
        if ($point.Y + 1 -lt $cellHeight) { $queue.Enqueue([System.Drawing.Point]::new($point.X, $point.Y + 1)) }
      }

      $destination = Join-Path $flowerFolder ("stage-{0:D2}.png" -f ($stage + 1))
      $crop.Save($destination, [System.Drawing.Imaging.ImageFormat]::Png)
      $crop.Dispose()
    }
  }
}

$sourceImage.Dispose()
