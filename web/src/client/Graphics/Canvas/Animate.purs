module Graphics.Canvas.Animate where

import Prelude
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE, log)
import Data.Maybe (Maybe(..))
import Data.List (List(..), filter, head, (:))
import Graphics.Canvas (CANVAS, rect, fillPath, setFillStyle, getContext2D
                       ,Context2D, getCanvasElementById)
import Partial.Unsafe (unsafePartial)
import DOM (DOM())
import DOM.HTML (window)
import DOM.HTML.Types (Window())
import Types
import Graphics.Canvas.Renderable

type Time = Number

-- foreign import requestAnimationFrame :: forall eff a. Window -> (Time -> a)
--                                 -> Eff (canvas :: CANVAS | eff) Unit
-- | This module exposes a polyfilled `requestAnimationFrame` function.


-- | Request the specified action be called on the next animation frame, specifying the `Window` object.
foreign import requestAnimationFrame :: forall a eff.
    -- Window -> Eff (dom :: DOM | eff) a -> Eff (dom :: DOM | eff) Unit
    Window -> (Time -> Eff (dom :: DOM | eff) a) -> Eff (dom :: DOM | eff) Unit

animationLoop :: forall e a. (Renderable a) =>
                 Window -> Context2D -> Behavior a
                   -> Eff (dom :: DOM, canvas :: CANVAS, console :: CONSOLE | e) Unit
animationLoop w ctx r = do
    log "animationLoop"
    requestAnimationFrame w $ log <<< show 
    -- requestAnimationFrame w $ initializeLoop w ctx r

initializeLoop :: forall e a. (Renderable a) =>
                 Window -> Context2D -> Behavior a -> Time
                   -> Eff (dom :: DOM, canvas :: CANVAS, console :: CONSOLE | e) Unit
initializeLoop w ctx r startTime = do 
    log "initializing"
    -- requestAnimationFrame w $ log "kinda worked"
    requestAnimationFrame w $ loopHelper w ctx r startTime

loopHelper :: forall e a. (Renderable a) =>
                 Window -> Context2D -> Behavior a -> Time -> Time
                   -> Eff (dom :: DOM, canvas :: CANVAS, console :: CONSOLE | e) Unit
                 -- Behavior a -> Time -> Time -> Eff (canvas :: CANVAS | eff) Time
loopHelper w ctx r startTime now = void do
    let time = now - startTime
    render ctx $ r `at` time
    -- requestAnimationFrame w $ log "kinda worked"
    requestAnimationFrame w $ loopHelper w ctx r startTime

