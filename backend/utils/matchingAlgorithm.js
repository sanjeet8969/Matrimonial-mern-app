export const calculateMatchScore = (userProfile, candidateProfile, preferences) => {
  let score = 0;
  let maxScore = 0;

  // Age matching (weight: 20)
  maxScore += 20;
  if (preferences.ageRange) {
    if (
      candidateProfile.age >= preferences.ageRange.min &&
      candidateProfile.age <= preferences.ageRange.max
    ) {
      score += 20;
    } else {
      const ageDiff = Math.min(
        Math.abs(candidateProfile.age - preferences.ageRange.min),
        Math.abs(candidateProfile.age - preferences.ageRange.max)
      );
      score += Math.max(0, 20 - ageDiff * 2);
    }
  }

  // Height matching (weight: 10)
  maxScore += 10;
  if (preferences.heightRange) {
    if (
      candidateProfile.height >= preferences.heightRange.min &&
      candidateProfile.height <= preferences.heightRange.max
    ) {
      score += 10;
    }
  }

  // Religion matching (weight: 15)
  maxScore += 15;
  if (preferences.religion && preferences.religion.length > 0) {
    if (preferences.religion.includes(candidateProfile.religion)) {
      score += 15;
    }
  } else {
    score += 15; // No preference means it matches
  }

  // Caste matching (weight: 10)
  maxScore += 10;
  if (preferences.caste && preferences.caste.length > 0) {
    if (preferences.caste.includes(candidateProfile.caste)) {
      score += 10;
    }
  } else {
    score += 10;
  }

  // Education matching (weight: 15)
  maxScore += 15;
  if (preferences.education && preferences.education.length > 0) {
    if (preferences.education.includes(candidateProfile.education?.highestQualification)) {
      score += 15;
    }
  } else {
    score += 15;
  }

  // Occupation matching (weight: 10)
  maxScore += 10;
  if (preferences.occupation && preferences.occupation.length > 0) {
    if (preferences.occupation.includes(candidateProfile.education?.occupation)) {
      score += 10;
    }
  } else {
    score += 10;
  }

  // Location matching (weight: 15)
  maxScore += 15;
  if (preferences.location) {
    let locationScore = 0;
    if (
      preferences.location.city &&
      preferences.location.city.includes(candidateProfile.address?.city)
    ) {
      locationScore = 15;
    } else if (
      preferences.location.state &&
      preferences.location.state.includes(candidateProfile.address?.state)
    ) {
      locationScore = 10;
    } else if (
      preferences.location.country &&
      preferences.location.country.includes(candidateProfile.address?.country)
    ) {
      locationScore = 5;
    }
    score += locationScore;
  } else {
    score += 15;
  }

  // Marital status matching (weight: 5)
  maxScore += 5;
  if (preferences.maritalStatus && preferences.maritalStatus.length > 0) {
    if (preferences.maritalStatus.includes(candidateProfile.maritalStatus)) {
      score += 5;
    }
  } else {
    score += 5;
  }

  // Calculate percentage
  const percentage = Math.round((score / maxScore) * 100);
  return percentage;
};
