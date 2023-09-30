export type SuperMemoValues = {
  easinessFactor: number;
  repetitions: number;
};

export class SuperMemo {
  private static calculateEasinessFactor(
    currentEasinessFactor: number,
    quality: number,
  ) {
    const newEF =
      currentEasinessFactor - 0.8 + 0.28 * quality - 0.02 * quality * quality;

    return Math.max(1.3, newEF);
  }

  private static calculateInterval(
    easinessFactor: number,
    repetitions: number,
  ) {
    let intervalDays: number;

    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 3; // reduced from 6
    else intervalDays = Math.round(repetitions * easinessFactor);

    const newIntervalDate = new Date();
    newIntervalDate.setDate(newIntervalDate.getDate() + intervalDays);

    return newIntervalDate;
  }

  static retrieveShortestInterval<T extends { interval: Date }>(
    data: T[],
  ): T | undefined {
    const sortedByDate = data.sort(
      (a, b) => new Date(a.interval).getTime() - new Date(b.interval).getTime(),
    );
    return sortedByDate.at(0);
  }

  static getUpdatedValues(
    oldEasinessFactor: number,
    repetitions: number,
    quality: number,
  ) {
    if (quality < 3)
      return {
        easinessFactor: 2.5,
        repetitions: 0,
        interval: new Date(),
      };

    const newEasinessFactor = this.calculateEasinessFactor(
      oldEasinessFactor,
      quality,
    );
    const newRepetitions = repetitions + 1;
    const newInterval = this.calculateInterval(
      newEasinessFactor,
      newRepetitions,
    );

    return {
      easinessFactor: newEasinessFactor,
      repetitions: newRepetitions,
      interval: newInterval,
    };
  }
}
