-- Delete existing to avoid duplicates if re-run
delete from exercises;

insert into exercises (name, category, description, duration_seconds, video_url) values
-- 1. Chin Tucks
('Chin Tucks', 'stretch', 'Relieves forward-head posture strain and activates deep neck muscles, helping reduce neck and upper-back tension caused by long hours at a desk.', 60, '/videos/chin-tucks-v1.webm'),

-- 2. Side Neck Stretch
('Side Neck Stretch', 'stretch', 'Releases tight side-neck muscles and improves flexibility, easing stiffness that builds up from prolonged screen use.', 60, '/videos/side-neck-stretch-v1.webm'),

-- 3. Seated Neck Rotation
('Seated Neck Rotation', 'stretch', 'Relieves built-up neck stiffness and improves range of motion, helping reduce tension from extended sitting.', 60, '/videos/seated-neck-rotation-v1.webm'),

-- 4. Upper Body & Arm Stretch
('Upper Body & Arm Stretch', 'stretch', 'Opens the chest and shoulders while releasing upper-body tightness caused by rounded desk posture.', 60, '/videos/upper-body-arm-stretch-v1.webm'),

-- 5. Triceps Stretch
('Triceps Stretch', 'stretch', 'Reduces upper-arm and shoulder tension while improving arm mobility after long periods of keyboard use.', 60, '/videos/triceps-stretch-v1.webm'),

-- 6. Seated Side Stretch
('Seated Side Stretch', 'stretch', 'Lengthens the spine and side muscles, helping counter spinal compression from prolonged sitting.', 60, '/videos/seated-side-stretch-v1.webm'),

-- 7. Pectoralis Stretch
('Pectoralis Stretch', 'stretch', 'Opens tight chest muscles and supports better posture by reversing forward-rounded shoulders.', 60, '/videos/pectoralis-stretch-v1.webm'),

-- 8. Seated Hip Stretch
('Seated Hip Stretch', 'stretch', 'Releases tight hip muscles and improves lower-body mobility restricted by extended sitting.', 60, '/videos/seated-hip-stretch-v1.webm'),

-- 9. Knee Extensions
('Knee Extensions', 'stretch', 'Improves knee joint movement and promotes healthy blood flow in the legs after inactivity.', 60, '/videos/knee-extensions-v1.webm'),

-- 10. Heel Slides
('Heel Slides', 'stretch', 'Gently restores knee and leg mobility while improving circulation during seated breaks.', 60, '/videos/heel-slides-v1.webm'),

-- 11. Sit to Stands
('Sit to Stands', 'cardio', 'Activates major lower-body muscles and boosts circulation, helping reset the body after long periods of sitting.', 60, '/videos/sit-to-stands-v1.webm'),

-- 12. Seated Calf Raises
('Seated Calf Raises', 'stretch', 'Improves lower-leg circulation and reduces stiffness caused by prolonged immobility.', 60, '/videos/seated-calf-raises-v1.webm'),

-- 13. Wrist Flexor Stretch
('Wrist Flexor Stretch', 'stretch', 'Relieves wrist and forearm strain from repetitive typing and mouse use.', 60, '/videos/wrist-flexor-stretch-v1.webm'),

-- 14. Wrist Circles
('Wrist Circles', 'stretch', 'Loosens stiff wrist joints and improves range of motion for smoother hand movement.', 60, '/videos/wrist-circles-v1.webm'),

-- 15. Eye Circles
('Eye Circles', 'eye', 'Reduces eye fatigue and refreshes visual focus after continuous screen exposure.', 60, '/videos/eye-8-rotation-v1.webm');
