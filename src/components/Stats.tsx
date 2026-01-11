'use client';

import { motion } from 'framer-motion';
import { Download, Star, Users, Award } from 'lucide-react';

interface StatsProps {
  totalDownloads: number;
  averageRating: number;
  totalReviews: number;
}

export default function Stats({ totalDownloads, averageRating, totalReviews }: StatsProps) {
  const stats = [
    {
      icon: Download,
      value: totalDownloads > 1000 ? `${(totalDownloads / 1000).toFixed(0)}K+` : `${totalDownloads}+`,
      label: 'Downloads',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Star,
      value: averageRating.toFixed(1),
      label: 'User Rating',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      icon: Users,
      value: totalReviews.toString(),
      label: 'Reviews',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: Award,
      value: '100%',
      label: 'Free Forever',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-gray-500 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}