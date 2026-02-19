export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
}

export interface Team {
  id: number;
  name: string;
  logo: string;
}

export interface MatchScore {
  home: number | null;
  away: number | null;
}

export interface Match {
  id: number;
  date: string;
  venue: string;
  league: {
    id: number;
    name: string;
    logo: string;
    round: string;
  };
  home: {
    id: number;
    name: string;
    logo: string;
    winner: boolean | null;
  };
  away: {
    id: number;
    name: string;
    logo: string;
    winner: boolean | null;
  };
  goals: MatchScore;
  score: {
    halftime: MatchScore;
    fulltime: MatchScore;
  };
}
