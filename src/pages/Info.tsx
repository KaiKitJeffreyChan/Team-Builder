import React from "react";
import { useRouter } from "next/router";

const Info: React.FC = () => {
  const router = useRouter();
  return (
    <div className="sm:p-32 bg-primary h-full p-12 font-shareTechMono text-white">
      <div className="flex justify-between items-center">
        <h1 className="my-4 text-2xl">
          Wow you were curious enought to press this!
        </h1>
        <button
          className="bg-secondary text-xs p-2 rounded"
          onClick={() => router.push("/Home")}
        >
          Back
        </button>
      </div>
      <p className="text-xs">
        TLDR (your welcome): This is a multi-agent simulation where you can
        customize multiple agents (create personalized versions of chatGPT or
        any other LLM), assign them a communication method, and give them a
        problem. The agents will then communicate with each other to solve the
        problem! The simulation will end when the problem is solved or the
        agents are unable to solve the problem.
      </p>

      <h1 className="my-4">A more detailed dive</h1>
      <p className="text-xs">
        "These LLMs are so powerful, but I wish I could customize them, better
        yet, get them to work on something together." After stumbling upon the
        idea of agents, I was really intrigued on the posabilites. If one agent
        could do so much, what could multiple agents do? This is where the idea
        of a multi-agent simulation came to be. The idea is simple, create
        multiple agents, give them a problem, and let them communicate with each
        other to solve the problem. The agents can be customized to use
        different models, communication methods, and personalities. The
        simulation will end when the problem is solved or the agents are unable
        to solve the problem.
      </p>
      <p className="text-xs py-3">
        As you could imagine, the possibilities are endless! You could create a
        team of engineers to solve a programming problem, a cast of screen
        writers to write a script, or even a group of chefs to create a recipe.
        The simulation is a great way to see how different agents can work
        together to solve a problem.
      </p>

      <h1 className="mb-4 mt-10 text-2xl ">How was this built?</h1>
      <p className="text-xs ">
        The main issue with customization of these prebuilt models comes down to
        the prompting (which was a pain). Initally I told each instance of the
        LLM that they were a brain; they would take on the personality and name
        provided to them by the user and then they would be given a problem to
        solve. I would them enter them into a communication method whether that
        be random or[ADD HERE]. I would then use prompts such as the following:
        <ul className="list-disc pl-10 my-3 py-5 bg-secondary rounded text-secHighlight">
          <li>
            I must respond with exactly one of the options, without saying
            anything else ["SPEAK", "LISTEN", "SPEAKWITHEDIT"].
          </li>
          <li>What would I like to do next?</li>
          <li>I can see that this is the current solution:</li>
        </ul>
        By using prompts like this, I was able to avoid using system prompts
        during conversation which was a problem I was running into when using
        Gemini. Before this iteration I would say the lines above to direct the
        agents. "You must respond with...", "What would you like to do...". None
        the less the results seem to be similar and this was more of a personal
        preference in favor of it working for the free model haha.
      </p>
      <p className="text-xs py-3">
        The prompt to initiate the model was strightforwards, however the prompt
        used to facilitate conversation was the kicker. Here is the beautiful
        prompt:
      </p>
      <div className="bg-secondary p-8 text-xs rounded text-secHighlight">
        <span>
          <p className="mb-3">
            I must respond with exactly one of the options, without saying
            anything else ["SPEAK", "LISTEN", "SPEAKWITHEDIT"]. Im going to read
            what each option means and respond with what I want to do
          </p>
          <span>Say "SPEAK" if:</span>
          <ul className="list-disc pl-5 my-3">
            <li>
              I want to continue the conversation; the conversation will end if
              all participants say "LISTEN".
            </li>
            <li>I have something new to say or a new idea to introduce.</li>
            <li> I want to speak without changing the solution. </li>
            <li> I want to ask a question or make a statement.</li>
            <li>
              I want to clarify or elaborate on a point without changing the
              solution yet.
            </li>
            <li>I want to respond to a question or comment.</li>
          </ul>
          <span>Say "LISTEN" if:</span>
          <ul className="list-disc pl-5 my-3">
            <li> I are bored or don't find the topic interesting.</li>
            <li> The conversation is wrapping up.</li>
            <li> I have nothing new to say.</li>
            <li>
              {" "}
              The conversation has been going on for a while; I get tired the
              longer the conversation goes on
            </li>
          </ul>
          <span>Say "SPEAKWITHEDIT" if:</span>
          <ul className="list-disc pl-5 my-3">
            <li>
              I am considering contributing a solution or improving upon an
              existing one.
            </li>
            <li>
              The current solution is incomplete or could be enhanced with a
              better idea or perspective.
            </li>
            <li>
              Someone else in the group has shared an idea worth incorporating,
              and I want to highlight or integrate it.
            </li>
            <li>
              There is consensus or discussion that suggests the solution needs
              to evolve or change.
            </li>
            <li>
              I want to refine, clarify, or optimize the solution to make it
              more effective.
            </li>
          </ul>
        </span>
      </div>
      <p className="text-xs py-3">
        I called this the LISTEN prompt as it was given to each agent after
        feeding them the most recent message sent. This way each model was able
        to make a decision on what to do next (what I think is an unconscious
        decision we do when we have human conversations). Depending on the
        communication method, this prompt is used to direct the conversation in
        a way humans would have a conversation, in hopes the agents will work
        together in solving the problem at hand.
      </p>
      <p className="text-xs py-3">
        This project was built using Next.js, TypeScript, Tailwind CSS, and
        Socket.IO. The project is hosted on Vercel and the code is available on
        GitHub. The project currently uses gemini-1.5-flash API to generate
        responses for the agents. The project uses Socket.IO to create a
        real-time connection between the client and server. The project uses
        Tailwind CSS for styling and Next.js for routing.
      </p>
    </div>
  );
};

export default Info;
