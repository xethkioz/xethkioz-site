extends Area2D

var velocity := Vector2.ZERO
var damage := 8.0
var lifetime := 4.0
var tint := Color(1.0,0.5,0.2)

func _ready() -> void:
	collision_layer = 8
	collision_mask = 1
	monitoring = true
	var cs := CollisionShape2D.new()
	var sh := CircleShape2D.new(); sh.radius = 7.0
	cs.shape = sh; add_child(cs)
	body_entered.connect(_on_body_entered)

func setup(vel: Vector2, dmg: float, life: float, color: Color) -> void:
	velocity = vel; damage = dmg; lifetime = life; tint = color; queue_redraw()

func _process(delta: float) -> void:
	position += velocity * delta
	lifetime -= delta
	rotation += delta * 4.0
	if lifetime <= 0.0: queue_free()

func _on_body_entered(body: Node) -> void:
	if body.is_in_group("player"):
		body.take_damage(damage,Vector2(-sign(velocity.x)*130.0,-80.0)); queue_free()

func _draw() -> void:
	draw_circle(Vector2.ZERO,7.0,tint)
	draw_circle(Vector2.ZERO,3.0,Color(1.0,0.92,0.65))
