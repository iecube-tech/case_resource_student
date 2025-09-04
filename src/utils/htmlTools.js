import { simpleMarked } from '@/ts/MyMarked';
import DOMPurify from 'isomorphic-dompurify';

function postprocess(html) {
    return DOMPurify.sanitize(html);
}
export const  parseHtml = (content) => {
  let str = simpleMarked.parse(content).replace(/<p[^>]*>\s*<\/p>/g, '')
  let htmlStr =  postprocess(str)
  return htmlStr
}