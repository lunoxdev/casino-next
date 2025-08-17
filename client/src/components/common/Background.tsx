import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

export default function Background() {
  return (
    <div className="absolute inset-0 -z-10">
      <ShaderGradientCanvas>
        <ShaderGradient
          control="query"
          urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=on&bgColor1=%23000000&bgColor2=%23000000&brightness=0.5&cAzimuthAngle=180&cDistance=3.9&cPolarAngle=115&cameraZoom=1&color1=%231447e6&color2=%2300a6f4&color3=%23000000&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&grain=off&lightType=3d&pixelDensity=3&positionX=-0.5&positionY=0.1&positionZ=0&range=disabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=0&rotationZ=235&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=0.7&uFrequency=5.5&uSpeed=0.2&uStrength=1.7&uTime=0.2&wireframe=false"
        />
      </ShaderGradientCanvas>
    </div>
  );
}
