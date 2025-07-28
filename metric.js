document.addEventListener("DOMContentLoaded" , function(){
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector('.easy-level');
    const mediumProgressCircle = document.querySelector('.medium-level'); 
    const hardProgressCircle = document.querySelector('.hard-level');
    const easyLabel = document.getElementById('easy');
    const mediumLabel = document.getElementById('medium');
    const hardLabel = document.getElementById('hard');
    const statsCard = document.querySelector('.stats-card');
    const info = document.querySelector('.information');
    const signChange=document.getElementById('sign');

 //check for valid usename returns t or f
        function validUserName(username){
                if(username.trim() === ""){
                    alert("Username should not be empty");
                    return false;
                }
               const regex = /^[a-zA-Z0-9_-]{1,15}$/;
               const isMatch = regex.test(username);
               if(!isMatch) {
                        alert("Invalid usename");
               }
               return isMatch;
        }

        async function fetchUserDetails(username) {
                 
                try{
                        const proxyUrl =" https://cors-anywhere.herokuapp.com/";
                        const tgturl = 'https://leetcode.com/graphql';
                        searchButton.textContent = "Searching...";
                        searchButton.disabled = true;

                        const myHeaders = new Headers();
                        myHeaders.append("content-type" , "application/json");

                     const graphql = JSON.stringify({
                                query: `
                                        query getUserData($username: String!) {
                                        matchedUser(username: $username) {
                                        username
                                        submitStats {
                                        acSubmissionNum {
                                                difficulty
                                                count
                                                submissions
                                        }
                                        totalSubmissionNum {
                                                difficulty
                                                count
                                                submissions
                                        }
                                        }
                                        submitStatsGlobal {
                                        acSubmissionNum {
                                                difficulty
                                                count
                                        }
                                        }
                                        }
                                        allQuestionsCount {
                                        difficulty
                                        count
                                        }
                                        }
                                `,
                        variables: {
                                username: `${username}`
                        }
                        });

                        const requestOptions = {
                                method:  "POST",
                                headers: myHeaders,
                                body:  graphql,
                                redirect:  "follow"
                        };

                        const response = await fetch(proxyUrl+tgturl, requestOptions);
                        if(!response.ok){
                                throw new Error("Unable to fetch user details");
                        }
                        const parseData = await response.json();
                        console.log("Logging data :" , parseData);

                        displayUserData(parseData);
                }
                catch(error)
                {
                        statsContainer.innerHTML = `<p>No data has been found</p>`;
                }
                finally{
                    searchButton.textContent = 'Search';
                    searchButton.disabled= false;
                }
        }

        function updateProgress(solved , total , label , circle)
        {
                        const progressDegree = (solved/total)*100;
                        circle.style.setProperty("--progress-degree" , `${progressDegree}%` );
                        label.textContent = `${solved}/${total}`;
        }

        function displayUserData(parseData)   
        {
                const totalQues = parseData.data.allQuestionsCount[0].count;
                const totalEasyQues = parseData.data.allQuestionsCount[1].count;
                const totalMediumQues = parseData.data.allQuestionsCount[2].count;
                const totalHardQues = parseData.data.allQuestionsCount[3].count;

                const solveTotalQues = parseData.data.matchedUser.submitStats.acSubmissionNum[0].count;
                const solveTotalEasyQues = parseData.data.matchedUser.submitStats.acSubmissionNum[1].count;
                const solveTotalMediumQues = parseData.data.matchedUser.submitStats.acSubmissionNum[2].count;
                const solveTotalHardQues = parseData.data.matchedUser.submitStats.acSubmissionNum[3].count;

                updateProgress(solveTotalEasyQues , totalEasyQues , easyLabel , easyProgressCircle );

                updateProgress(solveTotalMediumQues , totalMediumQues , mediumLabel , mediumProgressCircle);

                updateProgress(solveTotalHardQues , totalHardQues , hardLabel , hardProgressCircle);

                const cardsData = [
                        {label: "Overall Submissions" , value:  parseData.data.matchedUser.submitStats.totalSubmissionNum[0].submissions},
                         {label: "Overall Easy Submissions" , value:  parseData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions},
                        {label: "Overall Medium Submissions" , value:  parseData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions},
                        {label: "Overall Hard Submissions" , value:  parseData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions},
                ];
                console.log("Card ka data : ", cardsData);

                statsCard.innerHTML = cardsData.map(
                        data => 
                                `
                                        <div class = "card">
                                        <h4>${data.label}</h4>
                                        <p>${data.value}</p>
                                        </div>
                                `
                ).join("")
        } 

        searchButton.addEventListener('click' , function(){
        const username = usernameInput.value;
        console.log("Logging username : ", username);
            if(validUserName(username)){
                    fetchUserDetails(username);
            }
    })
})