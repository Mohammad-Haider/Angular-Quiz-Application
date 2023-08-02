import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent {
  constructor(private router: Router) {}
  //array containing question, options and the correct answer
  questionsList: any[] = [
    {
      question: 'Who is the vigilante of Gotham City?',
      options: ['Batman', 'Superman', 'Spiderman', 'none'],
      correctAnswer: 'Batman',
    },
    {
      question: 'Who killed Thanos in Endgame?',
      options: ['Thor', 'Iron Man', 'Iron Man & Thor', 'none'],
      correctAnswer: 'Iron Man & Thor',
    },
    {
      question: 'Who is the wizard Dr. in Marvel Cinematic Universe?',
      options: ['Steve', 'Christine', 'Strange', 'none'],
      correctAnswer: 'Strange',
    },
    {
      question: 'Which one is not an infinity stone?',
      options: ['Time', 'Power', 'Reality', 'Water'],
      correctAnswer: 'Water',
    },
  ];

  currentQuestionIndex: number = 0; //this represents the current index of the question
  selectedOption: string | null = null; // this will store the selected option
  showResult: boolean = false; //false because it won't show result untill time is complete or all questions are answered
  totalScore: number = 0; // variable to store total score
  timeLimitInSeconds: number = 50000; // time is represented in seconds
  timeLeft: number = this.timeLimitInSeconds; // this will store decrementing time
  userAnswers: string[] = []; // it will store every answer of the user
  arrayOfLeaders: number[] = []; //array to score result of every user
  nameOfCurrentUser: any = localStorage.getItem('name_of_user'); // stores the name from login page

  ngOnInit() {
    this.startTimer(); // on initialize timer gets started
  }

  //function written with help of a youtube tutorial
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const minutesString = minutes < 10 ? '0' + minutes : minutes.toString();
    const secondsString =
      remainingSeconds < 10
        ? '0' + remainingSeconds
        : remainingSeconds.toString();
    return `${minutesString}:${secondsString}`;
  }

  private startTimer() {
    const interval = setInterval(() => {
      this.timeLeft--; //decrements time left
      if (this.timeLeft <= 0) {
        // if time left becomes 0 then it will call onSubmit function
        clearInterval(interval);
        this.onSubmit();
      }
    }, 1000);
  }

  //this will give the current question to the user
  getCurrentQuestion(): any {
    return this.questionsList[this.currentQuestionIndex];
  }

  //this will store the selected option
  onOptionSelected(option: string) {
    this.selectedOption = option;
  }

  //on next question function
  onNextQuestion() {
    //firstly it checks that we have a selected option
    if (this.selectedOption !== null) {
      //we store our question of the specific index in currentQuestion and then check whether answer is correct

      const currentQuestion = this.getCurrentQuestion();
      //correctAnswer is the third element of our array
      //it checks if selectedoption matches correctanswer
      if (this.selectedOption === currentQuestion.correctAnswer) {
        this.totalScore++; //increments score
        alert('Congratulations!! you have scored a point'); //generates an alert to show you've scored a point
      } else {
        //if selected option doesn't match then it stores the correctasnwer and displays it
        const correctAnswer = currentQuestion.correctAnswer;
        alert(`Incorrect! the correct answer is ${correctAnswer}.`); //generates an alert and displays the answer
      }

      this.userAnswers.push(this.selectedOption); //option is now stored in the array of userAnswers

      this.selectedOption = null; //option is cleared
      this.showResult = false; //will not show result now
      this.currentQuestionIndex++; //index gets incremented

      //if index reaches length then onSubmit function is called
      if (this.currentQuestionIndex >= this.questionsList.length) {
        this.onSubmit();
      }
    }
  }
  onSubmit() {
    // Store the user answer for the current question if limit is reached
    this.userAnswers.push(this.selectedOption!); // ! is used to make sure no null value is being pushed

    // Set showResult to true to display the review section after submitting the quiz
    this.showResult = true;

    localStorage.setItem('current_user', this.nameOfCurrentUser);
    localStorage.setItem('score_of_user', JSON.stringify(this.totalScore));
  }

  //function when we move back to quiz after reviewing all our answers
  reviewAnswers() {
    this.currentQuestionIndex = 0; //sets the index back to zero
    this.showResult = false; //showResult gets false value now
  }

  showScores() {
    this.router.navigate(['login/scoretable']);
  }
}
