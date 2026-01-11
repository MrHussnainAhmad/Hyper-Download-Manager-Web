export interface Review {
  id: string;
  email: string;
  name: string;
  rating: number;
  review: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Bug {
  id: string;
  email: string;
  title: string;
  description: string;
  type: 'bug' | 'feature';
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Stats {
  totalDownloads: number;
  averageRating: number;
  totalReviews: number;
}