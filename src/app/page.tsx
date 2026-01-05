import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import Features from '@/components/Features';
import DownloadSection from '@/components/DownloadSection';
import Comparison from '@/components/Comparison';
import ReviewCarousel from '@/components/ReviewCarousel';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

async function getHomeData() {

  try {

    const [reviews, downloadCount, reviewStats, configs] = await Promise.all([

      prisma.review.findMany({

        where: { approved: true },

        orderBy: { createdAt: 'desc' },

        take: 12,

      }),

      prisma.download.count(),

      prisma.review.aggregate({

        where: { approved: true },

        _avg: { rating: true },

        _count: { id: true },

      }),

      prisma.platformConfig.findMany(),

    ]);



    return {

      reviews: JSON.parse(JSON.stringify(reviews)),

      totalDownloads: downloadCount,

      averageRating: reviewStats._avg.rating || 5,

      totalReviews: reviewStats._count.id,

      configs: JSON.parse(JSON.stringify(configs)),

    };

  } catch (error) {

    console.error('Error fetching home data:', error);

    return {

      reviews: [],

      totalDownloads: 1500,

      averageRating: 4.9,

      totalReviews: 0,

      configs: [],

    };

  }

}



export default async function Home() {

  const { reviews, totalDownloads, averageRating, totalReviews, configs } = await getHomeData();



  return (

    <>

      <Hero configs={configs} />

      <Stats

        totalDownloads={totalDownloads}

        averageRating={averageRating}

        totalReviews={totalReviews}

      />

      <Features />

      <DownloadSection configs={configs} />

      <Comparison />

      <ReviewCarousel reviews={reviews} />

    </>

  );

}
