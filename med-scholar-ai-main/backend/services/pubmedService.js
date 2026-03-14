import axios from 'axios';
import { parseStringPromise } from 'xml2js';

const BASE_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';

/**
 * Fetch papers from PubMed based on a topic
 * @param {string} topic 
 * @param {number} limit 
 */
export const fetchPapersByTopic = async (topic, limit = 10) => {
  try {
    const apiKey = process.env.NCBI_API_KEY;

    // 1. Search for paper IDs
    const searchResponse = await axios.get(`${BASE_URL}/esearch.fcgi`, {
      params: {
        db: 'pubmed',
        term: topic,
        retmode: 'json',
        retmax: limit,
        api_key: apiKey,
      },
    });

    const ids = searchResponse.data.esearchresult.idlist;

    if (!ids || ids.length === 0) {
      return [];
    }

    // 2. Fetch paper details using efetch (gets full info including abstracts in XML)
    const fetchResponse = await axios.get(`${BASE_URL}/efetch.fcgi`, {
      params: {
        db: 'pubmed',
        id: ids.join(','),
        retmode: 'xml',
        api_key: apiKey,
      },
    });

    const result = await parseStringPromise(fetchResponse.data);
    const articles = result.PubmedArticleSet.PubmedArticle;

    if (!articles) {
      return [];
    }

    // 3. Extract relevant details
    const papers = articles.map(article => {
      const medline = article.MedlineCitation[0];
      const articleData = medline.Article[0];
      const pmid = medline.PMID[0]._;
      
      // Extract Title
      const title = articleData.ArticleTitle[0];
      
      // Extract Authors
      const authors = articleData.AuthorList ? 
        articleData.AuthorList[0].Author.map(a => {
          if (a.CollectiveName) return a.CollectiveName[0];
          return `${a.LastName ? a.LastName[0] : ''} ${a.ForeName ? a.ForeName[0] : ''}`.trim();
        }) : [];

      // Extract Year
      let year = 'Unknown';
      try {
        const pubDate = articleData.Journal[0].JournalIssue[0].PubDate[0];
        year = pubDate.Year ? pubDate.Year[0] : (pubDate.MedlineDate ? pubDate.MedlineDate[0].substring(0, 4) : 'Unknown');
      } catch (e) {}

      // Extract Journal
      const journal = articleData.Journal[0].Title[0];

      // Extract Abstract
      let abstract = 'No abstract available';
      if (articleData.Abstract && articleData.Abstract[0].AbstractText) {
        abstract = articleData.Abstract[0].AbstractText.map(t => {
          if (typeof t === 'string') return t;
          if (t._) return t._;
          return '';
        }).join(' ');
      }

      return {
        id: pmid,
        title: typeof title === 'string' ? title : (title._ || 'No title'),
        authors,
        year,
        journal,
        abstract,
        url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`
      };
    });

    return papers;
  } catch (error) {
    console.error('Error fetching from PubMed:', error.message);
    throw new Error('Failed to fetch papers from PubMed');
  }
};
