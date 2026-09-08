extends SceneTree

const PREVIEW_DIR := "res://build/previews"
const EXPECTED_SIZE := Vector2i(640, 360)
const SAMPLE_STEP := 4
const MIN_UNIQUE_COLORS := 32
const MIN_LUMA_RANGE := 0.20
const MIN_TRANSITION_RATIO := 0.035
const MIN_COLORFUL_RATIO := 0.055

const PREVIEWS := [
	"v34_menu.png",
	"v34_creator.png",
	"v34_cuenca.png",
	"v34_lago.png",
	"v34_boss5.png",
	"v34_refugio.png"
]

var _failed := false

func _initialize() -> void:
	call_deferred("_run")

func _run() -> void:
	for filename in PREVIEWS:
		_check_preview(filename)
	if _failed:
		push_error("V3.5 visual quality gate FAILED")
		quit(1)
		return
	print("V3.5 visual quality gate PASSED")
	quit(0)

func _check_preview(filename: String) -> void:
	var project_path := "%s/%s" % [PREVIEW_DIR, filename]
	var absolute_path := ProjectSettings.globalize_path(project_path)
	if not FileAccess.file_exists(project_path):
		_fail("%s is missing" % filename)
		return

	var image := Image.new()
	var load_error := image.load(absolute_path)
	if load_error != OK:
		_fail("%s could not be loaded: %s" % [filename, error_string(load_error)])
		return
	if image.get_size() != EXPECTED_SIZE:
		_fail("%s has size %s instead of %s" % [filename, image.get_size(), EXPECTED_SIZE])
		return

	var colors: Dictionary = {}
	var min_luma := 1.0
	var max_luma := 0.0
	var sample_count := 0
	var colorful_count := 0
	var transition_count := 0
	var transition_tests := 0

	for y in range(0, EXPECTED_SIZE.y, SAMPLE_STEP):
		for x in range(0, EXPECTED_SIZE.x, SAMPLE_STEP):
			var color: Color = image.get_pixel(x, y)
			var luma := _luminance(color)
			min_luma = minf(min_luma, luma)
			max_luma = maxf(max_luma, luma)
			sample_count += 1
			if _saturation(color) >= 0.16:
				colorful_count += 1
			colors[_quantized_key(color)] = true

			if x + SAMPLE_STEP < EXPECTED_SIZE.x:
				transition_tests += 1
				if _color_distance(color, image.get_pixel(x + SAMPLE_STEP, y)) >= 0.045:
					transition_count += 1
			if y + SAMPLE_STEP < EXPECTED_SIZE.y:
				transition_tests += 1
				if _color_distance(color, image.get_pixel(x, y + SAMPLE_STEP)) >= 0.045:
					transition_count += 1

	var luma_range := max_luma - min_luma
	var transition_ratio := float(transition_count) / float(maxi(1, transition_tests))
	var colorful_ratio := float(colorful_count) / float(maxi(1, sample_count))
	var unique_colors := colors.size()

	print("VISUAL %s | unique=%d | luma_range=%.3f | transitions=%.3f | colorful=%.3f" % [
		filename, unique_colors, luma_range, transition_ratio, colorful_ratio
	])

	if unique_colors < MIN_UNIQUE_COLORS:
		_fail("%s is too visually flat: only %d sampled colors" % [filename, unique_colors])
	if luma_range < MIN_LUMA_RANGE:
		_fail("%s lacks luminance separation: %.3f" % [filename, luma_range])
	if transition_ratio < MIN_TRANSITION_RATIO:
		_fail("%s lacks local visual structure: %.3f transition ratio" % [filename, transition_ratio])
	if colorful_ratio < MIN_COLORFUL_RATIO:
		_fail("%s is too desaturated/monochrome: %.3f colorful ratio" % [filename, colorful_ratio])

func _quantized_key(color: Color) -> int:
	var r := clampi(roundi(color.r * 31.0), 0, 31)
	var g := clampi(roundi(color.g * 31.0), 0, 31)
	var b := clampi(roundi(color.b * 31.0), 0, 31)
	return (r << 10) | (g << 5) | b

func _luminance(color: Color) -> float:
	return color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722

func _saturation(color: Color) -> float:
	return maxf(color.r, maxf(color.g, color.b)) - minf(color.r, minf(color.g, color.b))

func _color_distance(a: Color, b: Color) -> float:
	return (absf(a.r - b.r) + absf(a.g - b.g) + absf(a.b - b.b)) / 3.0

func _fail(message: String) -> void:
	_failed = true
	push_error("VISUAL QUALITY: %s" % message)
