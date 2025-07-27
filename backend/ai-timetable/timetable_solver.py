# import sys, json
# from ortools.sat.python import cp_model

# def main():
#     data = json.load(sys.stdin)

#     # ✅ Sanitize all IDs into strings
#     def to_str(obj):
#         return {k: str(v) if '_id' in k or k.endswith('Id') else v for k, v in obj.items()}

#     classes = [to_str(c) for c in data['classes']]
#     subjects = [to_str(s) for s in data['subjects']]
#     teachers = [to_str(t) for t in data['teachers']]
#     mappings = [to_str(m) for m in data['mappings']]

#     DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
#     PERIODS = 8

#     class_ids = [c['_id'] for c in classes]
#     teacher_ids = [t['_id'] for t in teachers]

#     # ✅ Build class-subject-teacher mapping
#     class_subject_teacher = {}
#     for m in mappings:
#         c = m['classId']
#         s = m['subjectId']
#         t = m['teacherId']
#         class_subject_teacher.setdefault(c, {}).setdefault(s, []).append(t)

#     # ✅ Create model and variables
#     model = cp_model.CpModel()
#     timetable = {}
#     for c in class_ids:
#         for d in range(len(DAYS)):
#             for p in range(PERIODS):
#                 timetable[(c, d, p)] = model.NewIntVar(0, len(mappings) - 1, f'tt_{c}_{d}_{p}')

#     # ✅ Constraint 1: Teacher can't be in 2 places at once
#     for t in teacher_ids:
#         for d in range(len(DAYS)):
#             for p in range(PERIODS):
#                 slots = []
#                 for c in class_ids:
#                     for s in class_subject_teacher.get(c, {}):
#                         if t in class_subject_teacher[c][s]:
#                             idx = mappings.index(next(m for m in mappings if m['classId'] == c and m['subjectId'] == s and m['teacherId'] == t))
#                             bool_var = model.NewBoolVar(f'teacher_{t}_class_{c}_day_{d}_period_{p}')
#                             model.Add(timetable[(c, d, p)] == idx).OnlyEnforceIf(bool_var)
#                             model.Add(timetable[(c, d, p)] != idx).OnlyEnforceIf(bool_var.Not())
#                             slots.append(bool_var)
#                 if slots:
#                     model.AddAtMostOne(slots)

#     # ✅ Constraint 2: Only assign valid subject-teacher for a class
#     for c in class_ids:
#         for d in range(len(DAYS)):
#             for p in range(PERIODS):
#                 allowed = []
#                 for s in class_subject_teacher.get(c, {}):
#                     for t in class_subject_teacher[c][s]:
#                         idx = mappings.index(next(m for m in mappings if m['classId'] == c and m['subjectId'] == s and m['teacherId'] == t))
#                         allowed.append([idx])
#                 model.AddAllowedAssignments([timetable[(c, d, p)]], allowed)

#     # ✅ Solve the model
#     solver = cp_model.CpSolver()
#     status = solver.Solve(model)

#     # ✅ Collect output
#     output = []
#     if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
#         for c in class_ids:
#             class_name = next(cl['class_name'] for cl in classes if cl['_id'] == c)
#             for d, day in enumerate(DAYS):
#                 for p in range(PERIODS):
#                     idx = solver.Value(timetable[(c, d, p)])
#                     m = mappings[idx]
#                     subj = next(s['subjectName'] for s in subjects if s['_id'] == m['subjectId'])
#                     teacher_id = m['teacherId']

#                     output.append({
#                         "class": class_name,
#                         "day": day,
#                         "period": p + 1,
#                         "subject": subj,
#                         "teacherId": teacher_id
#                     })

#     print(json.dumps(output))
#     sys.exit(0 if output else 1)

# if __name__ == "__main__":
#     main()






import sys, json
from ortools.sat.python import cp_model

def main():
    data = json.load(sys.stdin)

    # ✅ Sanitize all IDs into strings
    def to_str(obj):
        return {k: str(v) if '_id' in k or k.endswith('Id') else v for k, v in obj.items()}

    classes = [to_str(c) for c in data['classes']]
    subjects = [to_str(s) for s in data['subjects']]
    teachers = [to_str(t) for t in data['teachers']]
    mappings = [to_str(m) for m in data['mappings']]

    DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    PERIODS = 8

    class_ids = [c['_id'] for c in classes]
    teacher_ids = [t['_id'] for t in teachers]

    # ✅ Build class-subject-teacher mapping
    class_subject_teacher = {}
    for m in mappings:
        c = m['classId']
        s = m['subjectId']
        t = m['teacherId']
        class_subject_teacher.setdefault(c, {}).setdefault(s, []).append(t)

    # ✅ Create model and variables
    model = cp_model.CpModel()
    timetable = {}
    for c in class_ids:
        for d in range(len(DAYS)):
            for p in range(PERIODS):
                timetable[(c, d, p)] = model.NewIntVar(0, len(mappings) - 1, f'tt_{c}_{d}_{p}')

    # ✅ Constraint 1: Teacher can't be in 2 places at once
    for t in teacher_ids:
        for d in range(len(DAYS)):
            for p in range(PERIODS):
                slots = []
                for c in class_ids:
                    for s in class_subject_teacher.get(c, {}):
                        if t in class_subject_teacher[c][s]:
                            idx = mappings.index(next(m for m in mappings if m['classId'] == c and m['subjectId'] == s and m['teacherId'] == t))
                            bool_var = model.NewBoolVar(f'teacher_{t}_class_{c}_day_{d}_period_{p}')
                            model.Add(timetable[(c, d, p)] == idx).OnlyEnforceIf(bool_var)
                            model.Add(timetable[(c, d, p)] != idx).OnlyEnforceIf(bool_var.Not())
                            slots.append(bool_var)
                if slots:
                    model.AddAtMostOne(slots)

    # ✅ Constraint 2: Only assign valid subject-teacher for a class
    for c in class_ids:
        for d in range(len(DAYS)):
            for p in range(PERIODS):
                allowed = []
                for s in class_subject_teacher.get(c, {}):
                    for t in class_subject_teacher[c][s]:
                        idx = mappings.index(next(m for m in mappings if m['classId'] == c and m['subjectId'] == s and m['teacherId'] == t))
                        allowed.append([idx])
                model.AddAllowedAssignments([timetable[(c, d, p)]], allowed)

    # ✅ Solve the model
    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    # ✅ Collect output
    output = []
    if status in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        for c in class_ids:
            class_name = next(cl['class_name'] for cl in classes if cl['_id'] == c)
            for d, day in enumerate(DAYS):
                for p in range(PERIODS):
                    idx = solver.Value(timetable[(c, d, p)])
                    m = mappings[idx]
                    subj = next(s['subjectName'] for s in subjects if s['_id'] == m['subjectId'])
                    
                    output.append({
                        "class": class_name,
                        "day": day,
                        "period": p + 1,
                        "subject": subj,
                        "teacherId": m['teacherId']  # ✅ only returning ID
                    })

    print(json.dumps(output))
    sys.exit(0 if output else 1)

if __name__ == "__main__":
    main()
