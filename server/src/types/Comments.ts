export interface CommentEntry {
  anonymousName: string;   
  comment: string;        
  date: string;            
}

export interface CommentSection {
  recipeID: string;
  comments: CommentEntry[];
}