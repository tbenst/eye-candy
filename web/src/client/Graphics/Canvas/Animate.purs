module Graphics.Canvas.Animate where

import Prelude
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE, log)
import Data.Maybe (Maybe(..))
import Data.List (List(..), filter, head, (:))
import Graphics.Canvas (CANVAS, rect, fillPath, setFillStyle, getContext2D
                       ,Context2D, getCanvasElementById, clearRect)
import Partial.Unsafe (unsafePartial)
import DOM (DOM())
import DOM.HTML (window)
import DOM.HTML.Types (Window())
import Types
import Graphics.Canvas.Renderable
import Debug.Trace (traceAny)

foreign import requestAnimationFrame :: forall a eff.
    Window -> (Time -> Eff (dom :: DOM | eff) a) -> Eff (dom :: DOM | eff) Unit

animationLoop :: forall e a. (Renderable a) =>
                 { w :: Window, ctx :: Context2D, width :: Number
                 , height :: Number, b :: Behavior a} -> Time
                   -> Eff (dom :: DOM, canvas :: CANVAS, console :: CONSOLE | e) Unit
animationLoop {w, ctx, width, height, b} t =
    let raf = requestAnimationFrame w
        loop t = do
            clearRect ctx { x: 0.0
                        , y: 0.0
                        , w: width
                        , h: height
                        }
            let world = b `at` t
            -- traceAny world \_ -> unit
            render ctx world
            raf loop 
    in do raf loop
