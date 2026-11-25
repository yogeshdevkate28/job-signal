
import re


def normalize_text(text):
    """Convert text into a consistent lowercase format."""
    return re.sub(r'\s+', ' ', text.lower()).strip()


def extract_matching_skills(text):
    """
    Identify known technical skills mentioned in CV or job text.
    """
    known_skills = [
        "python",
        "django",
        "fastapi",
        "flask",
        "java",
        "javascript",
        "typescript",
        "react",
        "node.js",
        "golang",
        "go",
        "postgresql",
        "mysql",
        "sqlite",
        "mongodb",
        "redis",
        "rest api",
        "docker",
        "kubernetes",
        "aws",
        "git",
        "linux",
        "html",
        "css",
        "machine learning",
        "deep learning",
        "data structures",
        "system design",
    ]

    normalized_text = normalize_text(text)
    found_skills = []

    for skill in known_skills:
        pattern = r'(?<!\w)' + re.escape(skill) + r'(?!\w)'

        if re.search(pattern, normalized_text):
            found_skills.append(skill)

    return found_skills

def calculate_job_match(profile, job):
    # 1. Get skills from the user's profile
    profile_skills = [
        normalize_text(skill)
        for skill in profile.skills
    ]

    # 2. Extract skills from the uploaded CV
    cv_skills = extract_matching_skills(profile.resume_text)

    # 3. Combine profile skills and CV skills
    user_skills = set(profile_skills + cv_skills)

    # 4. Extract required skills from the job
    job_skills = extract_matching_skills(job.skills)

    # 5. Find matched and missing skills
    matched_skills = sorted(user_skills.intersection(job_skills))
    missing_skills = sorted(set(job_skills) - user_skills)

    # 6. Calculate skill match percentage
    if job_skills:
        skill_score = (
            len(matched_skills) / len(job_skills)
        ) * 70
    else:
        skill_score = 0

    # 7. Check whether the desired role matches the job title
    job_title = normalize_text(job.title)

    role_match = any(
        normalize_text(role) in job_title
        or job_title in normalize_text(role)
        for role in profile.desired_roles
    )

    role_score = 30 if role_match else 0

    # 8. Calculate final match percentage
    match_percentage = round(skill_score + role_score)

    return {
        "match_percentage": match_percentage,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "role_match": role_match,
    }
