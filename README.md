<h1 align="center">furō</h1>

<p align="center">
  <a href="https://github.com/bfollington/furo/actions?query=workflow%3A%22Build%22"><img alt="Build" src="https://github.com/bfollington/furo/workflows/Build/badge.svg"></a>
<img alt="GitHub top language" src="https://img.shields.io/github/languages/top/bfollington/furo">
<img alt="GitHub" src="https://img.shields.io/github/license/bfollington/furo">

<br>
  <img alt="npm" src="https://img.shields.io/npm/v/@twopm/furo">
<img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/@twopm/furo">

</p><br>

**Furō** is an event bus for `React` applications. It can be used to tame complex asynchronous workflows.

[👁 &nbsp;Live Demo](https://furo.netlify.app/) (source in `packages/example`)

# Installation
```
npm i @twopm/furo
```

```
yarn add @twopm/furo
```

# Simple Example

```tsx
  const Demo = () => {
    const { dispatch, useSubscribe } = useEvents()
    const [form, setForm] = useState({})
    const onSubmit = () => { dispatch({ type: 'form-submit-requested', payload: form}) }

    useSubscribe('form-submit-success', () => {
      alert('Success!')
    })

    useSubscribe('form-submit-failed', (ev) => {
      alert('Failed, see console')
      console.error('Form submission failed', ev.errors)
    })

    return (
      <div>
        {/* form goes here*/}
        <button type="submit" onClick={onSubmit}>Submit</button>
      </div>
    )
  }

  // ... elsewhere

  const Consumer = () => {
    const { useSubscribe } = useEvents()

    useSubscribe('form-submit-requested', async (ev, dispatch) => {
      const res = await fetch(
        'https://example.com/profile',
          {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(ev.payload),
        }
      ).then(r => r.json())

      if (res.ok) {
        dispatch({ type: 'form-submit-success' })
      } else {
        dispatch({ type: 'form-submit-failed', errors: res.errors })
      }
    })

    return null
  }
```

# Installation

```
yarn add @twopm/furo
```

# Setup

// TODO

## Running this repo

### Bootstrap

```
yarn
yarn bootstrap
```

### Running the examples

```
cd packages/furo
yarn build
cd ../example
yarn start
```
