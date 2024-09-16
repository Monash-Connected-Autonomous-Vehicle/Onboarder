import { create } from "zustand";

interface RecruitmentDetails {
  roundId: number | null;
  roundDeadline: string | null;
  roundName: string | null;
  roundStatus: string | null;
}

interface RecruitmentStore {
  recruitmentDetails: RecruitmentDetails;
  setRecruitmentDetails: (details: RecruitmentDetails) => void;
  clearRecruitmentDetails: () => void;
}

export const useRecruitmentStore = create<RecruitmentStore>((set) => ({
  recruitmentDetails: {
    roundId: null,
    roundDeadline: null,
    roundName: null,
    roundStatus: null,
  },
  setRecruitmentDetails: (details) => set({ recruitmentDetails: details }),
  clearRecruitmentDetails: () =>
    set({
      recruitmentDetails: {
        roundId: null,
        roundDeadline: null,
        roundName: null,
        roundStatus: null,
      },
    }),
}));
