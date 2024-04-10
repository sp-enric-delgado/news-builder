import os

from fireman.utils import data
from fireman.services.ExecuteAdobeProcess import ExecuteAdobeProcess, ADOBE_PHOTOSHOP

_SCRIPT_NAME = "generate_spine_info_{}.jsx"


def perform(
    source, png_scale, sprites_padding, slots_scale, destination, skin_match_name, version_script="v1"
):
    params = {
        "outFolderPath": destination,
        "pngScale": png_scale,
        "slotsScale": slots_scale,
        "spritesPadding": sprites_padding,
        "skinMatchName": skin_match_name,
    }
    to_render = {"PARAMS": data.data2JsonInline(params)}

    script_name = _SCRIPT_NAME.format(version_script)
    executor_jsx = ExecuteAdobeProcess(
        script_name=script_name,
        source_file=source,
        adobe_program=ADOBE_PHOTOSHOP,
        to_render=to_render,
    )
    executor_jsx.execute()

    os.remove(executor_jsx.script_url)
