import React from "react";

import "./styles.css";
import { useInitFbSDK } from "./fb-hooks";
import { CSVLink } from "react-csv";

// You can find your Page ID
// in the "About" section of your page on Facebook.
  //แม่และเด็ก 1390712517855297
  //ขายทุกอย่าง 106079597654626
  //user test 100929475202891
  //user test2 101831721777584
const PAGE_ID = "100929475202891";
var allComment = [{name: "Joe Commenter", id: 126577551217199, message: "รูปภาพสวยมาก!" }]
const headers = [
  { label: "Name", key: "name" },
  { label: "Id", key: "id" },
  { label: "Message", key: "message" }
];

function App() {
  // Initializes the Facebook SDK
  const isFbSDKInitialized = useInitFbSDK();

  // App state
  const [fbUserAccessToken, setFbUserAccessToken] = React.useState();
  const [fbPageAccessToken, setFbPageAccessToken] = React.useState();
  const [postText, setPostText] = React.useState();
  const [urlText, setUrlText] = React.useState();
  const [userId, setUserId] = React.useState();
  const [pageId, setPageId] = React.useState();
  const [liveId, setLiveId] = React.useState();
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [isEnableLive, setIsEnableLive] = React.useState(true);
  const [isEnableExport, setIsEnableExport] = React.useState(false);


  // Logs in a Facebook user
  const logInToFB = React.useCallback(() => {
    window.FB.login((response) => {
      console.log('logInToFB =>',response)
      setFbUserAccessToken(response.authResponse.accessToken);
      setUserId(response.authResponse.userID)
    }, {scope: 'public_profile,email,user_posts,user_videos'});
  }, []);

  // Logs out the current Facebook user
  const logOutOfFB = React.useCallback(() => {
    window.FB.logout(() => {
      console.log('logOutOfFB =>')
      setPostText("");
      //allComment= []
      // setPageId('106079597654626')
      // setLiveId('287577192644247')
      setIsEnableLive(false)
      setFbUserAccessToken(null);
      setFbPageAccessToken(null);
    });
  }, []);

  // Checks if the user is logged in to Facebook
  React.useEffect(() => {
    if (isFbSDKInitialized) {
      window.FB.getLoginStatus((response) => {
        console.log('useEffect =>',response)
        setFbUserAccessToken(response.authResponse?.accessToken);
      });
    }
  }, [isFbSDKInitialized]);

  // Fetches an access token for the page
  React.useEffect(() => {
    if (fbUserAccessToken) {
      window.FB.api(
        `/${PAGE_ID}?fields=access_token&access_token=${fbUserAccessToken}`,
        ({ access_token }) => setFbPageAccessToken(access_token)
      );
    }
  }, [fbUserAccessToken]);

    // Fetches an access token for the page
    const accessPageToken = React.useCallback(() => {
      console.log('PAGE_ID =>',pageId)
      if(pageId != ''){
        if (fbUserAccessToken) {
          window.FB.api(
            `/${pageId}?fields=access_token&access_token=${fbUserAccessToken}`,
            ({ access_token }) => {
              console.log('access_token =>',access_token)
              if(liveId != ''){
                setIsEnableLive(false)
              }
              setFbPageAccessToken(access_token)
            }
          );
        }
      }
    }, [liveId,pageId,fbUserAccessToken]);

  // Publishes a post on the Facebook page
  const sendPostToPage = React.useCallback(() => {
    setIsPublishing(true);

    window.FB.api(
      `/${PAGE_ID}/feed`,
      "POST",
      {
        message: postText,
        access_token: fbPageAccessToken,
      },
      (res) => {
        console.log('sendPostToPage =>',postText,res)
        setPostText("");
        setIsPublishing(false);
      }
    );
  }, [postText, fbPageAccessToken]);

  // const sendPostToPage = React.useCallback(() => {
  //   console.log('url =>',urlText)

  // }, [urlText, fbPageAccessToken]);

  /* make the API call */
// FB.api(
//   "/{user-id}/ids_for_pages",
//   function (response) {
//     if (response && !response.error) {
//       /* handle the result */
//     }
//   }
// );

// Publishes a post on the Facebook page
const getPageId = React.useCallback(() => {
  console.log('userId =>',userId)

  window.FB.api(
    `/${userId}/ids_for_pages`,
    "GET",
    {
      access_token: fbUserAccessToken,
    },
    (response) => {
      console.log('getPageFeed =>',response)
      // let dataFeed = ''
      // for(let i in response.data){
      //   dataFeed += 'Date :'+ response.data[i].created_time + '\n\r'
      //   if(response.data[i].message){
      //     dataFeed += 'message :'+ response.data[i].message + '\n\r' 
      //   }else if(response.data[i].story){
      //     dataFeed += 'message :'+ response.data[i].story + '\n\r'  
      //   }
      //   dataFeed += '======================================= \n\r' 
      // }
      // setPostText(dataFeed);
    }
  );
}, [userId, fbUserAccessToken]);

  // Publishes a post on the Facebook page
  const getPageFeed = React.useCallback(() => {

    window.FB.api(
      `/${pageId}/feed`,
      "GET",
      {
        access_token: fbPageAccessToken,
      },
      (response) => {
        console.log('getPageFeed =>',response)
        let dataFeed = ''
        for(let i in response.data){
          dataFeed += 'Date :'+ response.data[i].created_time + '\n\r'
          if(response.data[i].message){
            dataFeed += 'message :'+ response.data[i].message + '\n\r' 
          }else if(response.data[i].story){
            dataFeed += 'message :'+ response.data[i].story + '\n\r'  
          }
          dataFeed += '======================================= \n\r' 
        }
        setPostText(dataFeed);
      }
    );
  }, [pageId, fbPageAccessToken]);

  const exportCsv = React.useCallback(() => {
    console.log(allComment)
    // click the CSVLink component to trigger the CSV download
    this.csvLink.link.click()

  },[allComment])


// headers = [
//   { label: "Name", key: "name" },
//   { label: "Id", key: "id" },
//   { label: "Message", key: "message" }
// ];

// data = [
//   { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
//   { firstname: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
//   { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" }
// ];

{/* <CSVLink data={allComment} headers={headers}>
  Download me
</CSVLink>; */}


//   var source = new EventSource("https://streaming-graph.facebook.com/{live-video-id}/live_comments?access_token={access-token}&comment_rate=one_per_two_seconds&fields=from{name,id},message");
// source.onmessage = function(event) {
//   // Do something with event.message for example
// };

//[ { "from": { name: "Joe Commenter", "id": 126577551217199 }, "ข้อความ": "รูปภาพสวยมาก!" } ] 

  // // Publishes a post on the Facebook page
  // const getCommentLive = React.useCallback(() => {
  //   console.log('vidio id =>',liveId)
  //   if(liveId != ''){
  //     window.FB.api(
  //       `/${liveId}/live_comments`,
  //       "GET",
  //       {
  //         access_token: fbPageAccessToken,
  //         comment_rate: 'ten_per_second',
  //         fields: 'from{name,id},message'
  //       },
  //       (response) => {
  //         console.log('getPageFeed =>',response)
  //         let dataFeed = ''
  //         for(let i in response.data){
  //           allComment.push(response.data[i])
  //           dataFeed += 'Date :'+ response.data[i].from.id + '\n\r'
  //           dataFeed += 'Date :'+ response.data[i].from.name + '\n\r'
  //           dataFeed += 'Date :'+ response.data[i].message + '\n\r'
  //         }
  //         setPostText(dataFeed);
  //       }
  //     );
  //   }
  // }, [liveId, fbPageAccessToken]);

  const getCommentLive = React.useCallback(() => {
    console.log('vidio id =>',liveId)
    if(liveId != ''){
      window.FB.api(
      `/${liveId}/live_comments?access_token=${fbPageAccessToken}&comment_rate=ten_per_second&fields=from{name,id},message`,
      (response ) => {
        console.log('getPageFeed =>',response)
        let dataFeed = ''
        if(response.data){
          for(let i in response.data){
            allComment.push(response.data[i])
            dataFeed += 'Date :'+ response.data[i].from.id + '\n\r'
            dataFeed += 'Date :'+ response.data[i].from.name + '\n\r'
            dataFeed += 'Date :'+ response.data[i].message + '\n\r'
          }
          setPostText(dataFeed);
          if(allComment.length){
            setIsEnableExport(false)
          }
        }
      });
    }
  }, [liveId, fbPageAccessToken]);


  // UI with custom styling from ./styles.css`
  return (
    <div id="app">
      <header id="app-header">
        <p id="logo-text">FB Page API</p>
        {fbUserAccessToken ? (
          <button onClick={logOutOfFB} className="btn confirm-btn">
            Log out
          </button>
        ) : (
          <button onClick={logInToFB} className="btn confirm-btn">
            Login with Facebook
          </button>
        )}
      </header>
      <div id="fb-root"></div>
      <script async defer crossorigin="anonymous" src="https://connect.facebook.net/th_TH/sdk.js#xfbml=1&version=v9.0&appId=751159112276292&autoLogAppEvents=1" nonce="9b2CSrN9"></script>
      <div class="fb-login-button" data-size="large" data-button-type="continue_with" data-layout="default" data-auto-logout-link="false" data-use-continue-as="false" data-width=""></div>

      <main id="app-main">
        {/* {fbPageAccessToken ? ( */}
          <section className="app-section">
            <h3>Page Id</h3>
            <input
              value={pageId}
              onChange={(e) => setPageId(e.target.value)}
              placeholder="Enter page id ..."
            />
            <h3>Live Id</h3>
            <input
              value={liveId}
              onChange={(e) => setLiveId(e.target.value)}
              placeholder="Enter live id..."
            />
            <button
              onClick={accessPageToken}
              className="btn confirm-btn"
            >
            go
            </button>
            <h3>Data response</h3>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Message..."
              rows="12"
              disabled={isPublishing}
            />
            {fbPageAccessToken ? (
              <div>
                {/* <button
                  onClick={sendPostToPage}
                  className="btn confirm-btn"
                  disabled={!postText || isPublishing}
                >
                  {isPublishing ? "Publishing..." : "Publish"}
                </button> */}
                <button
                  onClick={getPageFeed}
                  className="btn confirm-btn"
                >
                Get Feed
                </button>
                <button
                  onClick={getCommentLive}
                  className="btn confirm-btn"
                  disabled = {isEnableLive}
                >
                Start get comment
                </button> 
                {/* <button
                  onClick={exportCsv}
                  className="btn export btn"
                  disabled = {isEnableExport}
                >
                Export csv
                </button>  */}
                <CSVLink data={allComment} headers={headers}>
                  Export csv
                </CSVLink>
            </div>
            ):(
              <h2 className="placeholder-container">Enter Page id Live id</h2>
            )}
          </section>
      </main>
    </div>
  );
}

export default App;
