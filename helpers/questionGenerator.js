/**
 * Question Generator Helper
 * Contains utility functions for generating test questions
 */

// Constants
const MATCHING_QUESTION_TEXT = 'จับคู่พยัญชนะกับภาพให้ถูกต้อง (จับคู่)';
const NO_DATA_MESSAGE = 'ไม่มีข้อมูลสำหรับจับคู่';
const MIN_MATCHING_OPTIONS = 4;
const MAX_SELECTED_PAIRS = 2;
const EARLY_CHAPTER_THRESHOLD = 4; // Chapters 1-4
const LATE_CHAPTER_START = 5; // Chapters 5-8

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array (new array, original not modified)
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Gets all available pairs from all lessons for cross-lesson selection
 * @returns {Array} - Array of pair objects with chapter information
 */
export function getAllAvailablePairs() {
  return [
    // Chapter 1
    { left: 'ก', leftImage: '/แบบทดสอบ/บทที่1/ก.png', right: 'ไก่', rightImage: '/แบบทดสอบ/บทที่1/ไก่.png', chapter: 1 },
    { left: 'ง', leftImage: '/แบบทดสอบ/บทที่1/ง.png', right: 'งู', rightImage: '/แบบทดสอบ/บทที่1/งู.png', chapter: 1 },
    // Chapter 2
    { left: 'จ', leftImage: null, right: 'จาน', rightImage: '/แบบทดสอบ/บทที่2/จาน.png', chapter: 2 },
    { left: 'ช', leftImage: '/แบบทดสอบ/บทที่2/ช.png', right: 'ช้าง', rightImage: '/แบบทดสอบ/บทที่2/ช้าง.png', chapter: 2 },
    // Chapter 3
    { left: 'ต', leftImage: null, right: 'เต่า', rightImage: '/แบบทดสอบ/บทที่3/เต่า.png', chapter: 3 },
    { left: 'ม', leftImage: null, right: 'ม้า', rightImage: '/แบบทดสอบ/บทที่3/ม้า.png', chapter: 3 },
    { left: 'ป', leftImage: '/แบบทดสอบ/บทที่3/ป.png', right: 'ปลา', rightImage: '/แบบทดสอบ/บทที่3/ปลา.png', chapter: 3 },
    // Chapter 4
    { left: 'ฮ', leftImage: '/แบบทดสอบ/บทที่4/ฮ.png', right: 'ฮิปโป', rightImage: '/แบบทดสอบ/บทที่4/ฮิปโป.png', chapter: 4 },
    { left: 'ล', leftImage: '/แบบทดสอบ/บทที่4/ล.png', right: 'ลิง', rightImage: '/แบบทดสอบ/บทที่4/ลิง.png', chapter: 4 },
    // Chapter 5
    { left: 'ป', leftImage: null, right: 'ปลา', rightImage: '/แบบทดสอบ/บทที่5/ปลา.png', chapter: 5 },
    { left: 'ต', leftImage: null, right: 'ตา', rightImage: '/แบบทดสอบ/บทที่5/ตา.png', chapter: 5 },
    { left: 'ก', leftImage: null, right: 'กา', rightImage: '/แบบทดสอบ/บทที่5/กา.png', chapter: 5 },
    { left: 'ข', leftImage: null, right: 'ขา', rightImage: '/แบบทดสอบ/บทที่5/ขา.png', chapter: 5 },
    // Chapter 6
    { left: 'ห', leftImage: null, right: 'หนี', rightImage: '/แบบทดสอบ/บทที่6/หนี.png', chapter: 6 },
    { left: 'ต', leftImage: null, right: 'ตี', rightImage: '/แบบทดสอบ/บทที่6/ตี.png', chapter: 6 },
    { left: 'ผ', leftImage: null, right: 'ผี', rightImage: '/แบบทดสอบ/บทที่6/ผี.png', chapter: 6 },
    { left: 'ห', leftImage: null, right: 'หีบ', rightImage: '/แบบทดสอบ/บทที่6/หีบ.png', chapter: 6 },
    // Chapter 7
    { left: 'ถ', leftImage: '/แบบทดสอบ/บทที่7/ถือ.png', right: 'ถือ', rightImage: '/แบบทดสอบ/บทที่7/ถือ.png', chapter: 7 },
    { left: 'ด', leftImage: '/แบบทดสอบ/บทที่7/ดื้อ.png', right: 'ดื้อ', rightImage: '/แบบทดสอบ/บทที่7/ดื้อ.png', chapter: 7 },
    { left: 'ม', leftImage: '/แบบทดสอบ/บทที่7/มือ.png', right: 'มือ', rightImage: '/แบบทดสอบ/บทที่7/มือ.png', chapter: 7 },
    { left: 'ซ', leftImage: '/แบบทดสอบ/บทที่7/ซื้อ.png', right: 'ซื้อ', rightImage: '/แบบทดสอบ/บทที่7/ซื้อ.png', chapter: 7 },
    // Chapter 8
    { left: 'ต', leftImage: '/แบบทดสอบ/บทที่8/ตุ๊กตา.png', right: 'ตุ๊กตา', rightImage: '/แบบทดสอบ/บทที่8/ตุ๊กตา.png', chapter: 8 },
    { left: 'ข', leftImage: '/แบบทดสอบ/บทที่8/ขุด.png', right: 'ขุด', rightImage: '/แบบทดสอบ/บทที่8/ขุด.png', chapter: 8 },
    { left: 'ก', leftImage: '/แบบทดสอบ/บทที่8/กุ้ง.png', right: 'กุ้ง', rightImage: '/แบบทดสอบ/บทที่8/กุ้ง.png', chapter: 8 },
    { left: 'ถ', leftImage: '/แบบทดสอบ/บทที่8/ถุง.png', right: 'ถุง', rightImage: '/แบบทดสอบ/บทที่8/ถุง.png', chapter: 8 }
  ];
}

/**
 * Filters pairs that have both leftImage and rightImage
 * @param {Array} pairs - Array of pair objects
 * @returns {Array} - Filtered pairs with both images
 */
export function filterPairsWithImages(pairs) {
  return pairs.filter(pair => pair.leftImage && pair.rightImage);
}

/**
 * Gets distractor words for matching questions
 * @param {number} chapterNumber - Current chapter number
 * @param {Array} correctWords - Words that are correct answers
 * @param {Array} currentLessonPairs - Pairs from current lesson
 * @param {Array} allAvailablePairs - All pairs from all lessons
 * @returns {Array} - Array of distractor objects { word, image }
 */
export function getDistractorWords(chapterNumber, correctWords, currentLessonPairs, allAvailablePairs) {
  const pairsWithImages = filterPairsWithImages(currentLessonPairs);
  
  if (chapterNumber <= EARLY_CHAPTER_THRESHOLD) {
    // For chapters 1-4: use words from chapters 5-8 that have images
    const wordsFromOtherChapters = allAvailablePairs
      .filter(pair => 
        pair.chapter >= LATE_CHAPTER_START && 
        pair.chapter <= 8 && 
        pair.rightImage && 
        !correctWords.includes(pair.right)
      )
      .map(pair => ({ word: pair.right, image: pair.rightImage }));
    
    const uniqueWords = Array.from(
      new Map(wordsFromOtherChapters.map(wordObj => [wordObj.word, wordObj])).values()
    );
    
    return shuffleArray(uniqueWords).slice(0, MAX_SELECTED_PAIRS);
  } else {
    // For chapters 5-8: use words from current lesson pairs that have images
    const distractorPairs = pairsWithImages.filter(pair => !correctWords.includes(pair.right));
    return shuffleArray(distractorPairs)
      .slice(0, MAX_SELECTED_PAIRS)
      .map(pair => ({ word: pair.right, image: pair.rightImage }));
  }
}

/**
 * Ensures we have exactly 4 options with images
 * @param {Array} currentOptions - Current options array
 * @param {number} chapterNumber - Current chapter number
 * @param {Array} pairsWithImages - Pairs from current lesson with images
 * @param {Array} allAvailablePairs - All pairs from all lessons
 * @returns {Array} - Options array with exactly 4 items
 */
export function ensureFourOptions(currentOptions, chapterNumber, pairsWithImages, allAvailablePairs) {
  let options = [...currentOptions];
  
  while (options.length < MIN_MATCHING_OPTIONS) {
    if (chapterNumber <= EARLY_CHAPTER_THRESHOLD) {
      // For chapters 1-4: prefer words from other chapters with images
      const wordsFromOtherChapters = allAvailablePairs
        .filter(pair => 
          pair.chapter >= LATE_CHAPTER_START && 
          pair.chapter <= 8 && 
          pair.rightImage && 
          !options.some(opt => opt.word === pair.right)
        )
        .map(pair => ({ word: pair.right, image: pair.rightImage }));
      
      const uniqueWords = Array.from(
        new Map(wordsFromOtherChapters.map(wordObj => [wordObj.word, wordObj])).values()
      );
      
      if (uniqueWords.length > 0) {
        options.push(uniqueWords[0]);
      } else {
        // Fallback to current lesson pairs with images
        const remainingPairs = pairsWithImages.filter(
          pair => !options.some(opt => opt.word === pair.right)
        );
        if (remainingPairs.length > 0) {
          const pair = remainingPairs[0];
          options.push({ word: pair.right, image: pair.rightImage });
        } else {
          break;
        }
      }
    } else {
      // For chapters 5-8: use words from current lesson pairs with images
      const remainingPairs = pairsWithImages.filter(
        pair => !options.some(opt => opt.word === pair.right)
      );
      if (remainingPairs.length > 0) {
        const pair = remainingPairs[0];
        options.push({ word: pair.right, image: pair.rightImage });
      } else {
        // If still not enough, try allAvailablePairs
        const wordsFromAllPairs = allAvailablePairs
          .filter(pair => 
            pair.rightImage && 
            !options.some(opt => opt.word === pair.right)
          )
          .map(pair => ({ word: pair.right, image: pair.rightImage }));
        
        const uniqueWords = Array.from(
          new Map(wordsFromAllPairs.map(wordObj => [wordObj.word, wordObj])).values()
        );
        
        if (uniqueWords.length > 0) {
          options.push(uniqueWords[0]);
        } else {
          break;
        }
      }
    }
  }
  
  return options.slice(0, MIN_MATCHING_OPTIONS);
}

/**
 * Creates a default matching question structure when no data is available
 * @returns {Object} - Default matching question object
 */
export function createDefaultMatchingQuestion() {
  return {
    question: MATCHING_QUESTION_TEXT,
    options: [],
    imageOptions: [],
    correctAnswer: [],
    explanation: NO_DATA_MESSAGE,
    isMatching: true,
    matchingPairs: []
  };
}

/**
 * Generates a random matching question for a lesson
 * @param {Array} lessonPairs - Pairs from the current lesson
 * @param {Array} allConsonants - All consonants for the lesson
 * @param {Array} allWords - All words for the lesson
 * @param {number} chapterNumber - Chapter number (1-8)
 * @returns {Object} - Matching question object
 */
export function generateRandomMatchingQuestion(lessonPairs, allConsonants, allWords, chapterNumber) {
  // Validate input
  if (!lessonPairs || lessonPairs.length === 0) {
    return createDefaultMatchingQuestion();
  }
  
  const allAvailablePairs = getAllAvailablePairs();
  const pairsWithImages = filterPairsWithImages(lessonPairs);
  
  if (pairsWithImages.length === 0) {
    return createDefaultMatchingQuestion();
  }
  
  // Randomly select 2 pairs from current lesson's pairs that have images
  const shuffledLessonPairs = shuffleArray([...pairsWithImages]);
  const selectedPairs = shuffledLessonPairs.slice(0, Math.min(MAX_SELECTED_PAIRS, shuffledLessonPairs.length));
  
  // Get correct words from selected pairs
  const correctWords = selectedPairs.map(pair => pair.right);
  
  // Get distractor words
  let distractorWords = getDistractorWords(chapterNumber, correctWords, lessonPairs, allAvailablePairs);
  
  // Fill in more distractors if needed
  if (distractorWords.length < MAX_SELECTED_PAIRS) {
    const remainingPairs = pairsWithImages.filter(
      pair => 
        !correctWords.includes(pair.right) && 
        !distractorWords.some(distractor => distractors.word === pair.right)
    );
    const additionalDistractors = shuffleArray(remainingPairs)
      .slice(0, MAX_SELECTED_PAIRS - distractorWords.length)
      .map(pair => ({ word: pair.right, image: pair.rightImage }));
    distractorWords = [...distractorWords, ...additionalDistractors];
  }
  
  // If still not enough, try to get from allAvailablePairs
  if (distractorWords.length < MAX_SELECTED_PAIRS) {
    const wordsFromAllPairs = allAvailablePairs
      .filter(pair => 
        pair.rightImage && 
        !correctWords.includes(pair.right) && 
        !distractorWords.some(distractor => distractors.word === pair.right)
      )
      .map(pair => ({ word: pair.right, image: pair.rightImage }));
    
    const uniqueWords = Array.from(
      new Map(wordsFromAllPairs.map(wordObj => [wordObj.word, wordObj])).values()
    );
    const additional = shuffleArray(uniqueWords).slice(0, MAX_SELECTED_PAIRS - distractorWords.length);
    distractorWords = [...distractorWords, ...additional];
  }
  
  // Create correct options from selected pairs
  const correctOptions = correctWords.map(word => {
    const pair = selectedPairs.find(p => p.right === word);
    return { word, image: pair.rightImage };
  });
  
  // Combine and shuffle all options
  let allOptions = shuffleArray([...correctOptions, ...distractorWords]);
  
  // Ensure we have exactly 4 options with images
  allOptions = ensureFourOptions(allOptions, chapterNumber, pairsWithImages, allAvailablePairs);
  
  // Extract words and images separately
  const optionWords = allOptions.map(option => option.word);
  const imageOptions = allOptions.map(option => option.image);
  
  // Create correct answer: array of option indices for matching pairs
  const correctAnswer = selectedPairs
    .map(pair => optionWords.indexOf(pair.right))
    .filter(index => index !== -1);
  
  // Create explanation
  const explanation = `จับคู่พยัญชนะกับภาพที่ถูกต้อง: ${selectedPairs.map(pair => `${pair.left}-${pair.right}`).join(', ')}`;
  
  return {
    question: MATCHING_QUESTION_TEXT,
    options: optionWords,
    imageOptions: imageOptions,
    correctAnswer: correctAnswer.length > 0 ? correctAnswer : [0, 1],
    explanation: explanation,
    isMatching: true,
    matchingPairs: selectedPairs.map(pair => ({
      left: pair.left,
      leftImage: pair.leftImage,
      right: pair.right,
      rightImage: pair.rightImage
    }))
  };
}
