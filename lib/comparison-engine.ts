export interface StandardContent {
  id: string
  standard: "PMBOK" | "PRINCE2" | "ISO"
  section: string
  title: string
  content: string
  keywords: string[]
  category: string
}

export interface ComparisonResult {
  topic: string
  similarities: StandardContent[]
  differences: StandardContent[]
  unique: StandardContent[]
  relevanceScore: number
}

// Mock database of standard contents
const mockStandardsDatabase: StandardContent[] = [
  // Risk Management
  {
    id: "pmbok-risk-1",
    standard: "PMBOK",
    section: "Chapter 11 - Project Risk Management",
    title: "Risk Management Process",
    content:
      "Risk management is the process of identifying, analyzing, and responding to risk factors throughout the life of a project. It includes maximizing the probability and consequences of positive events and minimizing the probability and consequences of negative events.",
    keywords: ["risk", "management", "identify", "analyze", "respond", "probability", "impact"],
    category: "risk-management",
  },
  {
    id: "prince2-risk-1",
    standard: "PRINCE2",
    section: "Risk Theme",
    title: "Risk Management Strategy",
    content:
      "The Risk theme provides an approach to identify, assess and control uncertainty and, as a result, improve the ability of the project to succeed. Risk management is integrated into all PRINCE2 processes.",
    keywords: ["risk", "theme", "identify", "assess", "control", "uncertainty", "strategy"],
    category: "risk-management",
  },
  {
    id: "iso-risk-1",
    standard: "ISO",
    section: "ISO 21500:2021 - Section 4.3.8",
    title: "Risk Management Guidelines",
    content:
      "Risk management should be an integral part of project management and should be embedded in the culture and practices. The organization should establish and maintain risk management processes.",
    keywords: ["risk", "management", "integral", "embedded", "culture", "processes"],
    category: "risk-management",
  },

  // Stakeholder Management
  {
    id: "pmbok-stakeholder-1",
    standard: "PMBOK",
    section: "Chapter 13 - Project Stakeholder Management",
    title: "Stakeholder Engagement",
    content:
      "Project Stakeholder Management includes the processes required to identify the people, groups, or organizations that could impact or be impacted by the project, analyze stakeholder expectations and their impact on the project.",
    keywords: ["stakeholder", "engagement", "identify", "analyze", "expectations", "impact"],
    category: "stakeholder-management",
  },
  {
    id: "prince2-stakeholder-1",
    standard: "PRINCE2",
    section: "Organization Theme",
    title: "Stakeholder Engagement",
    content:
      "The Organization theme defines and establishes the project's structure of accountability and responsibilities. It addresses stakeholder engagement throughout the project lifecycle.",
    keywords: ["organization", "stakeholder", "engagement", "accountability", "responsibilities"],
    category: "stakeholder-management",
  },
  {
    id: "iso-stakeholder-1",
    standard: "ISO",
    section: "ISO 21500:2021 - Section 4.3.2",
    title: "Stakeholder Management",
    content:
      "Stakeholders should be identified and their needs, expectations and influence on the project should be analyzed. Stakeholder engagement should be planned and managed throughout the project.",
    keywords: ["stakeholder", "identify", "needs", "expectations", "influence", "engagement"],
    category: "stakeholder-management",
  },

  // Quality Management
  {
    id: "pmbok-quality-1",
    standard: "PMBOK",
    section: "Chapter 8 - Project Quality Management",
    title: "Quality Management Process",
    content:
      "Project Quality Management includes the processes for incorporating the organization's quality policy regarding planning, managing, and controlling project and product quality requirements.",
    keywords: ["quality", "management", "policy", "planning", "controlling", "requirements"],
    category: "quality-management",
  },
  {
    id: "prince2-quality-1",
    standard: "PRINCE2",
    section: "Quality Theme",
    title: "Quality Management Approach",
    content:
      "The Quality theme defines and implements the means by which the project will create and verify products that are fit for purpose. Quality planning and quality control are key activities.",
    keywords: ["quality", "theme", "verify", "fit for purpose", "planning", "control"],
    category: "quality-management",
  },
  {
    id: "iso-quality-1",
    standard: "ISO",
    section: "ISO 21500:2021 - Section 4.3.6",
    title: "Quality in Project Management",
    content:
      "Quality management should ensure that the project will satisfy the needs for which it was undertaken. Quality planning, quality assurance, and quality control should be addressed.",
    keywords: ["quality", "management", "satisfy", "needs", "planning", "assurance", "control"],
    category: "quality-management",
  },
]

export class ComparisonEngine {
  private database: StandardContent[]

  constructor() {
    this.database = mockStandardsDatabase
  }

  // Search for content across all standards
  searchStandards(query: string): StandardContent[] {
    const searchTerms = query
      .toLowerCase()
      .split(" ")
      .filter((term) => term.length > 2)

    return this.database
      .map((content) => ({
        ...content,
        relevance: this.calculateRelevance(content, searchTerms),
      }))
      .filter((content) => content.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
  }

  // Generate comparison analysis for a specific topic
  generateComparison(query: string): ComparisonResult {
    const searchResults = this.searchStandards(query)
    const groupedByStandard = this.groupByStandard(searchResults)

    return {
      topic: query,
      similarities: this.findSimilarities(groupedByStandard),
      differences: this.findDifferences(groupedByStandard),
      unique: this.findUniquePoints(groupedByStandard),
      relevanceScore: searchResults.length > 0 ? searchResults[0].relevance : 0,
    }
  }

  // Filter results by analysis type
  filterByAnalysisType(query: string, analysisType: "similarities" | "differences" | "unique"): StandardContent[] {
    const comparison = this.generateComparison(query)

    switch (analysisType) {
      case "similarities":
        return comparison.similarities
      case "differences":
        return comparison.differences
      case "unique":
        return comparison.unique
      default:
        return []
    }
  }

  // Return top unique points per standard without needing a query
  getGlobalUniquePoints(limitPerStandard = 3): StandardContent[] {
    const byStandard: Record<StandardContent["standard"], StandardContent[]> = {
      PMBOK: [],
      PRINCE2: [],
      ISO: [],
    }

    // Group all content by standard
    this.database.forEach((item) => {
      byStandard[item.standard].push(item)
    })

    const pickTopUnique = (items: StandardContent[]): StandardContent[] => {
      // Score each item by 1 - max overlap with any other standard in the same category
      const scored = items.map((item) => {
        const othersSameCategory = this.database.filter(
          (o) => o.standard !== item.standard && o.category === item.category,
        )
        const maxOverlap =
          othersSameCategory.length === 0
            ? 0
            : Math.max(...othersSameCategory.map((o) => this.keywordOverlapRatio(item.keywords, o.keywords)))
        const uniqueScore = 1 - maxOverlap
        return { item, uniqueScore }
      })

      // Sort by uniqueScore desc, then pick top N
      return scored
        .sort((a, b) => b.uniqueScore - a.uniqueScore)
        .slice(0, limitPerStandard)
        .map((s) => s.item)
    }

    const out = [
      ...pickTopUnique(byStandard.PMBOK),
      ...pickTopUnique(byStandard.PRINCE2),
      ...pickTopUnique(byStandard.ISO),
    ]

    // De-dupe by id just in case
    const seen = new Set<string>()
    return out.filter((x) => {
      if (seen.has(x.id)) return false
      seen.add(x.id)
      return true
    })
  }

  private calculateRelevance(content: StandardContent, searchTerms: string[]): number {
    let score = 0
    const contentText = `${content.title} ${content.content}`.toLowerCase()

    searchTerms.forEach((term) => {
      // Title matches get higher score
      if (content.title.toLowerCase().includes(term)) {
        score += 10
      }
      // Content matches
      if (content.content.toLowerCase().includes(term)) {
        score += 5
      }
      // Keyword matches
      if (content.keywords.some((keyword) => keyword.includes(term))) {
        score += 8
      }
    })

    return score
  }

  private groupByStandard(contents: StandardContent[]): Record<string, StandardContent[]> {
    return contents.reduce(
      (acc, content) => {
        if (!acc[content.standard]) {
          acc[content.standard] = []
        }
        acc[content.standard].push(content)
        return acc
      },
      {} as Record<string, StandardContent[]>,
    )
  }

  private findSimilarities(groupedContent: Record<string, StandardContent[]>): StandardContent[] {
    const standards = Object.keys(groupedContent)
    if (standards.length < 2) return []

    // Find content that appears in multiple standards (same category)
    const similarities: StandardContent[] = []
    const categories = new Set<string>()

    Object.values(groupedContent)
      .flat()
      .forEach((content) => {
        categories.add(content.category)
      })

    categories.forEach((category) => {
      const standardsWithCategory = standards.filter((standard) =>
        groupedContent[standard].some((content) => content.category === category),
      )

      if (standardsWithCategory.length >= 2) {
        standardsWithCategory.forEach((standard) => {
          const categoryContent = groupedContent[standard].find((content) => content.category === category)
          if (categoryContent) {
            similarities.push(categoryContent)
          }
        })
      }
    })

    return similarities
  }

  private findDifferences(groupedContent: Record<string, StandardContent[]>): StandardContent[] {
    // Find content that has different approaches or terminology
    const differences: StandardContent[] = []
    const standards = Object.keys(groupedContent)

    standards.forEach((standard) => {
      groupedContent[standard].forEach((content) => {
        // Check if other standards have different approaches to the same category
        const otherStandards = standards.filter((s) => s !== standard)
        const hasDifferentApproach = otherStandards.some((otherStandard) => {
          const otherContent = groupedContent[otherStandard]?.find((c) => c.category === content.category)
          return otherContent && this.hasSignificantDifference(content, otherContent)
        })

        if (hasDifferentApproach) {
          differences.push(content)
        }
      })
    })

    return differences
  }

  private findUniquePoints(groupedContent: Record<string, StandardContent[]>): StandardContent[] {
    const unique: StandardContent[] = []
    const standards = Object.keys(groupedContent)

    standards.forEach((standard) => {
      groupedContent[standard].forEach((content) => {
        // Check if this category/approach is unique to this standard
        const otherStandards = standards.filter((s) => s !== standard)
        const isUnique = !otherStandards.some((otherStandard) =>
          groupedContent[otherStandard]?.some((c) => c.category === content.category),
        )

        if (isUnique) {
          unique.push(content)
        }
      })
    })

    return unique
  }

  private hasSignificantDifference(content1: StandardContent, content2: StandardContent): boolean {
    // Simple heuristic: check if they have different key terms
    const keywords1 = new Set(content1.keywords)
    const keywords2 = new Set(content2.keywords)
    const intersection = new Set([...keywords1].filter((x) => keywords2.has(x)))
    const union = new Set([...keywords1, ...keywords2])

    // If less than 50% overlap in keywords, consider it a significant difference
    return intersection.size / union.size < 0.5
  }

  // Global unique helper: compute overlap between keyword sets
  private keywordOverlapRatio(keywords1: string[], keywords2: string[]): number {
    const s1 = new Set(keywords1)
    const s2 = new Set(keywords2)
    const intersection = new Set([...s1].filter((k) => s2.has(k))).size
    const union = new Set([...s1, ...s2]).size || 1
    return intersection / union
  }
}

// Export singleton instance
export const comparisonEngine = new ComparisonEngine()
