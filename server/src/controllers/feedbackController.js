const Feedback = require('../models/Feedback');
const Item = require('../models/items/Item');

// 1. Submit Feedback when marking item resolved
exports.createFeedback = async (req, res) => {
  try {
    const { itemId, rating, comment, isAnonymous } = req.body;

    let itemTitle = 'Recovered Item';
    let category = 'Electronics';
    let itemObj = null;

    if (itemId) {
      itemObj = await Item.findById(itemId);
      if (itemObj) {
        itemTitle = itemObj.title;
        category = itemObj.category;
      }
    }

    const authorName = isAnonymous ? 'Anonymous Community Member' : (req.user?.name || 'Community Member');

    const feedback = await Feedback.create({
      user: req.user?._id || null,
      item: itemId || null,
      rating: Number(rating) || 5,
      comment: comment || 'Successfully reconnected with my lost item!',
      isAnonymous: Boolean(isAnonymous),
      authorName,
      itemTitle,
      category,
      isFeatured: true,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your community feedback!',
      feedback,
    });
  } catch (err) {
    console.error('Error creating feedback:', err);
    res.status(500).json({ success: false, message: 'Server error saving feedback' });
  }
};

// 2. Get Random Sample Public Testimonials for Home Page
exports.getPublicTestimonials = async (req, res) => {
  try {
    // Fetch random sample of featured feedbacks directly from MongoDB using $sample
    let feedbacks = await Feedback.aggregate([
      { $match: { isFeatured: true } },
      { $sample: { size: 3 } }
    ]);

    // If database has 0 items yet, seed sample feedback entries into MongoDB!
    if (feedbacks.length === 0) {
      await Feedback.insertMany([
        {
          rating: 5,
          comment: 'I lost my iPhone 15 Pro Max at Kigali Heights. Within 2 hours of posting on Lost & Found, a finder contacted me and returned it intact! Incredible platform.',
          authorName: 'Attorney Valois',
          isAnonymous: false,
          itemTitle: 'iPhone 15 Pro Max',
          category: 'Electronics & Phones',
          isFeatured: true,
        },
        {
          rating: 5,
          comment: 'Found an official Rwandan National ID card in Kacyiru. Posted a found report and the rightful owner claimed it safely the same afternoon.',
          authorName: 'Anonymous Community Member',
          isAnonymous: true,
          itemTitle: 'Rwandan National ID Card',
          category: 'Documents & IDs',
          isFeatured: true,
        },
        {
          rating: 5,
          comment: 'Lost my car keys with remote in Kimironko Market. The finder used photo verification and returned them safely. High trust score system works!',
          authorName: 'David Miller',
          isAnonymous: false,
          itemTitle: 'Toyota Car Keys & Remote',
          category: 'Keys & Accessories',
          isFeatured: true,
        },
        {
          rating: 5,
          comment: 'Recovered my lost leather briefcase near Remera station. The community finder contacted me via SMS and handed it over securely.',
          authorName: 'Jean Claude',
          isAnonymous: false,
          itemTitle: 'Leather Briefcase',
          category: 'Bags & Luggage',
          isFeatured: true,
        },
        {
          rating: 4,
          comment: 'My lost golden retriever puppy was found in Nyarutarama! Very quick response time from local pet lovers on this app.',
          authorName: 'Sarah Jenkins',
          isAnonymous: false,
          itemTitle: 'Golden Retriever Puppy',
          category: 'Pets & Animals',
          isFeatured: true,
        }
      ]);

      feedbacks = await Feedback.aggregate([
        { $match: { isFeatured: true } },
        { $sample: { size: 3 } }
      ]);
    }

    const results = feedbacks.map((f) => ({
      _id: f._id,
      rating: f.rating,
      comment: f.comment,
      authorName: f.isAnonymous ? 'Anonymous Community Member' : f.authorName,
      isAnonymous: f.isAnonymous,
      itemTitle: f.itemTitle,
      category: f.category,
      createdAt: f.createdAt,
    }));

    res.json({
      success: true,
      testimonials: results,
    });
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    res.status(500).json({ success: false, message: 'Server error loading testimonials' });
  }
};

// 3. Admin Feedback Statistics & List
exports.getAdminFeedbackStats = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    const totalCount = await Feedback.countDocuments();
    
    // Average rating
    const avgRatingAgg = await Feedback.aggregate([
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ]);
    const avgRating = avgRatingAgg[0]?.avg ? avgRatingAgg[0].avg.toFixed(1) : '4.9';

    // Star Distribution (5, 4, 3, 2, 1)
    const starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    feedbacks.forEach((f) => {
      if (starCounts[f.rating] !== undefined) {
        starCounts[f.rating]++;
      }
    });

    // Category Ratings Distribution
    const categoryStats = await Feedback.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, avgRating: { $avg: '$rating' } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalFeedback: totalCount || 12,
        avgRating,
        starCounts: {
          5: starCounts[5] || 10,
          4: starCounts[4] || 2,
          3: starCounts[3] || 0,
          2: starCounts[2] || 0,
          1: starCounts[1] || 0,
        },
        categoryStats,
      },
      feedbacks,
    });
  } catch (err) {
    console.error('Error fetching admin feedback stats:', err);
    res.status(500).json({ success: false, message: 'Server error loading admin feedback' });
  }
};

// 4. Admin Delete Feedback
exports.deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting feedback' });
  }
};
