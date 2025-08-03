// Utility functions for document version control

export const getVersionColor = (changeType: string) => {
  switch (changeType) {
    case "major": return "bg-red-500 text-white";
    case "minor": return "bg-blue-500 text-white";
    case "patch": return "bg-green-500 text-white";
    case "hotfix": return "bg-orange-500 text-white";
    default: return "bg-gray-500 text-white";
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "published": return "bg-green-500 text-white";
    case "draft": return "bg-yellow-500 text-white";
    case "under_review": return "bg-blue-500 text-white";
    case "archived": return "bg-gray-500 text-white";
    case "obsolete": return "bg-red-500 text-white";
    default: return "bg-gray-400 text-white";
  }
};

export const parseVersionNumber = (versionString: string) => {
  const parts = versionString.split('.');
  return {
    major: parseInt(parts[0]) || 1,
    minor: parseInt(parts[1]) || 0,
    patch: parseInt(parts[2]) || 0,
  };
};

export const generateVersionNumber = (major: number, minor: number, patch: number) => {
  return `${major}.${minor}.${patch}`;
};

export const getNextVersionNumber = (currentVersion: string, changeType: string) => {
  const { major, minor, patch } = parseVersionNumber(currentVersion);
  
  switch (changeType) {
    case "major":
      return generateVersionNumber(major + 1, 0, 0);
    case "minor":
      return generateVersionNumber(major, minor + 1, 0);
    case "patch":
      return generateVersionNumber(major, minor, patch + 1);
    case "hotfix":
      return generateVersionNumber(major, minor, patch + 1);
    default:
      return generateVersionNumber(major, minor, patch + 1);
  }
};

export const formatVersionHistory = (versions: any[]) => {
  return versions.map(version => ({
    ...version,
    versionColor: getVersionColor(version.changeType),
    statusColor: getStatusColor(version.status),
    formattedDate: new Date(version.createdAt).toLocaleDateString(),
    shortSummary: version.summary?.substring(0, 100) + (version.summary?.length > 100 ? '...' : ''),
  }));
};

export const detectContentChanges = (oldContent: string, newContent: string) => {
  // Simple change detection
  const oldWords = oldContent.split(/\s+/);
  const newWords = newContent.split(/\s+/);
  
  const additions = newWords.length - oldWords.length;
  const similarity = calculateSimilarity(oldContent, newContent);
  
  return {
    additions: Math.max(0, additions),
    deletions: Math.max(0, -additions),
    similarity,
    hasSignificantChanges: similarity < 0.8,
  };
};

export const calculateSimilarity = (str1: string, str2: string) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) {
    return 1.0;
  }
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
};

const levenshteinDistance = (str1: string, str2: string) => {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};

export const getVersionSuggestion = (currentVersion: string, changeType: string, hasBreakingChanges: boolean) => {
  const { major, minor, patch } = parseVersionNumber(currentVersion);
  
  if (hasBreakingChanges || changeType === "major") {
    return generateVersionNumber(major + 1, 0, 0);
  } else if (changeType === "minor") {
    return generateVersionNumber(major, minor + 1, 0);
  } else {
    return generateVersionNumber(major, minor, patch + 1);
  }
};