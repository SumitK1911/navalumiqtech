export interface Blog {

  id: string;

  title: string;

  slug: string;

  description: string;

  content: string;

  image: string;

  category: string;

  published: boolean;

  createdAt: Date;
}