-- Delete existing to avoid duplicates if re-run
delete from exercises;

insert into exercises (name, category, description, duration_seconds) values
-- 1. Chin Tucks
('Chin Tucks', 'stretch', 'Start with neutral position - chin touching the index finger.
1 sec - head moving backward.
4 secs - holding the face in that position.
1 sec - head coming back to neutral position.
Loop ends.', 60),

-- 2. Side neck stretch
('Side Neck Stretch', 'stretch', 'Start Position: Person seated upright on a chair.
Gentle Tilt (2 sec): Head slowly tilts to the right, ear moving toward shoulder.
Hold Stretch (7 sec): Head remains gently tilted.
Return to Center (1 sec): Head slowly returns to neutral.
Repeat.', 60),

-- 3. Seated Neck Rotation
('Seated Neck Rotation', 'stretch', 'Start Position: Person seated upright.
Rotate (2 sec): Head slowly turns to the right. Chin stays level.
Hold End Range (1 sec): Head gently holds at comfortable end.
Return to Center (2 sec): Head slowly rotates back to center.
Repeat on other side.', 60),

-- 4. Upper Body & Arm Stretch
('Upper Body & Arm Stretch', 'stretch', 'Lift Arms Overhead (2 sec): Push your arms stretching upward. Palms facing upward.
Hold Stretch (26 sec): Arms remain overhead. Spine stays tall.
Release (2 sec): Back to upright position.', 60),

-- 5. Triceps Stretch
('Triceps Stretch', 'stretch', 'Start Position: Left hand reaches up and lightly presses the right elbow backward/downward.
Hold Stretch (30 sec): Stretch is held comfortably.
Change Hand.', 60),

-- 6. Seated Side Stretch
('Seated Side Stretch', 'stretch', 'Start Position: Right arm lifts straight up toward ceiling.
Side Bend (2 sec): Upper body gently bends to the left.
Hold Stretch (26 sec): Stretch held comfortably.
Back to center position (2 sec).', 60),

-- 7. Pectoralis Stretch
('Pectoralis Stretch', 'stretch', 'Start Position: Arms behind the body.
Chest Opening Movement (2 sec): Arms gently straighten and lift. Shoulders roll down/back.
Hold Stretch (25 sec).
Release (3 sec): Back to start position.', 60),

-- 8. Seated Hip Stretch
('Seated Hip Stretch', 'stretch', 'Start Position: Right ankle gently placed over left knee. Upright position.
Forward Lean (2 mins): Upper body leans slightly forward from the hips.
Hold Stretch (26 sec): Stretch held comfortably.
Return to Neutral (2 sec).', 60),

-- 9. Knee Extensions
('Knee Extensions', 'stretch', 'Start Position: Person seated upright on chair.
Extend leg (1 sec): Right leg slowly extends forward.
Lower Leg (1 sec): Right foot returns slowly to floor.
Repeat with other leg.', 60),

-- 10. Heel Slides
('Heel Slides', 'stretch', 'Start Position: Person seated upright on chair.
Slide Heel Forward (1 sec): Right heel slides forward along the floor.
Slide Heel Back (1 sec): Heel slides back under the knee.
Repeat with other leg.', 60),

-- 11. Sit to Stands
('Sit to Stands', 'cardio', 'Start Position: Person seated near front edge of chair.
Stand Up (2 sec): Person leans slightly forward from hips.
Stand Tall Pause (1 sec): Person fully upright.
Sit Down (2 sec): Hips move back first.
5 sec loop.', 60),

-- 12. Seated Calf Raises
('Seated Calf Raises', 'stretch', 'Start Position: Person seated upright on chair.
Lift Heels (1 sec): Heels lift off the floor.
Hold at Top (1 sec): Heels stay raised.
Lower Heels (1 sec): Heels lower back to floor slowly.
3 sec loop.', 60),

-- 13. Wrist Flexor Stretch
('Wrist Flexor Stretch', 'stretch', 'Start Position: Person seated upright. Right arm extended forward. Palm facing outward.
Action (1 sec): Left hand lightly presses the fingers backward.
Hold Stretch (13 sec): Stretch held comfortably.
Release (1 sec).
Repeat on other side.', 60),

-- 14. Wrist Circles
('Wrist Circles', 'stretch', 'Start Position: Person seated upright. Forearms lifted.
Wrist Rotation (28 sec): Both wrists rotate slowly and smoothly.
Transition Pause (2 sec): Wrists return to neutral.
Other side rotation for 30 sec.', 60),

-- 15. Eye Circles
('Eye Circles', 'eye', '4 seconds for one figure-8 eye movement.
Repeat continuously.', 60);
