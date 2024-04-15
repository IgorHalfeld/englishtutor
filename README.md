## `englishtutor`

*This is a submission for the [Cloudflare AI Challenge](https://dev.to/devteam/join-us-for-the-cloudflare-ai-challenge-3000-in-prizes-5f99).*

## What I Built

I built an app that you can SPEAK directly in the browser and get instant feedback about your vocabulary by talking with "english tutor"

This app can easily become a micro saas, where you ask about the language the customer wants to learn and get paid by use.

## Demo

Link to [video demo 🚀](https://www.youtube.com/watch?v=es9RQaPi7jA)

Link to [live demo 🤙🏻](https://englishtutor.pages.dev/)

## Journey

I live in Brazil and here a lot of people don't practice speaking so I built this app to use AI to help them enhance english skills.

AI Models used:
 - `@cf/openai/whisper`
 - `@cf/qwen/qwen1.5-0.5b-chat`

## Feedbacks to Cloudflare

This is my first time using CF Worker and I know how important it is to get feedback from customers, so here is mine:

- Workers DX are not good
The best way I found to make this work great was by using Honojs

- 1MB to deploy a frontend is not enough
I faced this trouble when deploying Nuxt app, so I made a [workaround versioning static generated files](https://github.com/IgorHalfeld/englishtutor/tree/main/.output)
_As you can see by the source code above, it's a really simple app to get this message about the size_

- Whisper could have a parameter to pass the language
If I could define the language I'm speaking this would not happen
![error screenshot](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/uh5dtvw935h6rnutfgu4.png)

- Generic errors from wrangler commands when using AI Workers
Errors like "Unknown internal error" happened multiple times


### Setup

```bash
# install deps
yarn install

# generate static files
yarn genereate
```