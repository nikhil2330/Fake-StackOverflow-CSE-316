import React,{useEffect, useState} from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/authContext';

export default function TagsPage({getTagQuestion, AskQuestion}) {
  const [tags, setTags] = useState([]);
  const [tagcount, setTagCount] = useState(0);
  const { currentUser } = useAuth();


  useEffect(() => {

    axios.get('http://localhost:8000/tags')
      .then(response =>{ 
        setTags(response.data);
        const totalCount = response.data.reduce((acc, tag) => acc + tag.questionCount, 0);
        setTagCount(totalCount);
      })
      .catch(error => console.error('Error fetching tags:', error));
  }, []);

    return (
      <div id="Tags">
        <div id="tags-A"> 
          <div className="tagsC" id="tagsC">{tagcount}</div>
          &nbsp;
          <div className="tag-s-" id="tag-s-">{(tagcount > 1 || tagcount < 1) ? 'Tags' : 'Tag'}</div>
          <div className="Ttitle" id="Ttitle"> All tags </div>
          {currentUser && (<button className  = "button1" id="button1" onClick={AskQuestion}>Ask Question</button>)}
        </div>
        <div className="tagsbox" id="tagsbox">
          <div className="tags-container" id="tags-container">
            {tags.map(tag => (
              <div className="tag" key={tag._id}>
                <div className="tag-name" onClick={() => getTagQuestion(tag._id)} >{tag.name}</div>
                <div className="tag-question-count">{tag.questionCount  + " " + ((tag.questionCount  > 1 || tag.questionCount  < 1) ? 'Questions' : 'Question')}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }