type Rating = 1 | 2 | 3 | 4 | 5;

interface Beer {
    id: number;
    name: string;
    breweryName: string;
    tastingDate: Date;
    alcoholPercentage: number;
    labelPhoto?: string;
    sweetness: Rating;
    bitterness: Rating;
    sourness: Rating;
    overallRating: Rating;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}
